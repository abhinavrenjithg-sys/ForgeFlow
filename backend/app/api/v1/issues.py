from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from typing import List, Optional

from backend.app.core.database import get_db
from backend.app.models.issue import Issue, Label
from backend.app.models.project import Project
from backend.app.models.user import User
from backend.app.schemas.issue import IssueCreate, IssueUpdate, IssueResponse, LabelResponse
from backend.app.schemas.user import UserResponse
from backend.app.api.deps import get_workspace_membership
from backend.app.services.activity_service import log_activity

router = APIRouter(prefix="/workspaces/{slug}/issues", tags=["Issues"])

def serialize_issue(issue: Issue, db: Session) -> IssueResponse:
    resp = IssueResponse.model_validate(issue)
    resp.assignee = UserResponse.model_validate(issue.assignee) if issue.assignee else None
    resp.reporter = UserResponse.model_validate(issue.reporter) if issue.reporter else None
    resp.labels = [LabelResponse.model_validate(lbl) for lbl in issue.labels]
    resp.comments_count = len(issue.comments) if issue.comments else 0
    resp.subtasks_count = len(issue.subtasks) if issue.subtasks else 0
    return resp

@router.get("", response_model=List[IssueResponse])
def list_issues(
    project_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    assignee_id: Optional[str] = Query(None),
    label_id: Optional[str] = Query(None),
    cycle_id: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("order"),
    order_dir: Optional[str] = Query("asc"),
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, membership = context
    query = db.query(Issue).filter(Issue.workspace_id == workspace.id)

    if project_id:
        query = query.filter(Issue.project_id == project_id)
    if status:
        query = query.filter(Issue.status == status)
    if priority:
        query = query.filter(Issue.priority == priority)
    if cycle_id:
        query = query.filter(Issue.cycle_id == cycle_id)
    if assignee_id:
        if assignee_id == "me":
            query = query.filter(Issue.assignee_id == membership.user_id)
        elif assignee_id == "unassigned":
            query = query.filter(Issue.assignee_id.is_(None))
        else:
            query = query.filter(Issue.assignee_id == assignee_id)
    if label_id:
        query = query.filter(Issue.labels.any(Label.id == label_id))
    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Issue.title.ilike(search_term),
                Issue.sequence_id.ilike(search_term),
                Issue.description.ilike(search_term)
            )
        )

    # Sorting
    sort_column = Issue.order
    if sort_by == "created_at":
        sort_column = Issue.created_at
    elif sort_by == "updated_at":
        sort_column = Issue.updated_at
    elif sort_by == "due_date":
        sort_column = Issue.due_date

    if order_dir == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))

    issues = query.all()
    return [serialize_issue(issue, db) for issue in issues]

@router.post("", response_model=IssueResponse, status_code=status.HTTP_201_CREATED)
def create_issue(
    issue_in: IssueCreate,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, membership = context
    project = db.query(Project).filter(
        Project.id == issue_in.project_id,
        Project.workspace_id == workspace.id
    ).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found in this workspace"
        )

    # Compute atomic sequence_id e.g. FORGE-101
    issue_num = project.next_issue_number
    project.next_issue_number += 1
    sequence_id = f"{project.identifier}-{issue_num}"

    issue = Issue(
        workspace_id=workspace.id,
        project_id=project.id,
        sequence_id=sequence_id,
        title=issue_in.title.strip(),
        description=issue_in.description,
        status=issue_in.status or "todo",
        priority=issue_in.priority or "medium",
        order=issue_in.order if issue_in.order is not None else float(issue_num * 1000),
        assignee_id=issue_in.assignee_id,
        reporter_id=membership.user_id,
        cycle_id=issue_in.cycle_id,
        parent_issue_id=issue_in.parent_issue_id,
        due_date=issue_in.due_date,
        estimate_points=issue_in.estimate_points
    )

    # Attach labels
    if issue_in.label_ids:
        labels = db.query(Label).filter(
            Label.id.in_(issue_in.label_ids),
            Label.workspace_id == workspace.id
        ).all()
        issue.labels = labels

    db.add(issue)
    db.commit()
    db.refresh(issue)

    # Activity log & notification
    log_activity(
        db=db,
        workspace_id=workspace.id,
        actor_id=membership.user_id,
        verb="created",
        issue_id=issue.id,
        field_name="issue",
        new_value=issue.title,
        notify_user_id=issue.assignee_id,
        notification_title=f"New issue assigned: {issue.sequence_id}",
        notification_message=f"{membership.user.full_name} assigned you to '{issue.title}'"
    )
    db.commit()

    return serialize_issue(issue, db)

@router.get("/{issue_id}", response_model=IssueResponse)
def get_issue_details(
    issue_id: str,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, _ = context
    issue = db.query(Issue).filter(
        Issue.id == issue_id,
        Issue.workspace_id == workspace.id
    ).first()
    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found in this workspace"
        )
    return serialize_issue(issue, db)

@router.patch("/{issue_id}", response_model=IssueResponse)
def update_issue(
    issue_id: str,
    update_in: IssueUpdate,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, membership = context
    issue = db.query(Issue).filter(
        Issue.id == issue_id,
        Issue.workspace_id == workspace.id
    ).first()
    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found in this workspace"
        )

    # Track changes for audit history
    if update_in.title is not None and update_in.title.strip() != issue.title:
        log_activity(db, workspace.id, membership.user_id, "updated_title", issue.id, "title", issue.title, update_in.title.strip())
        issue.title = update_in.title.strip()

    if update_in.description is not None and update_in.description != issue.description:
        issue.description = update_in.description

    if update_in.status is not None and update_in.status != issue.status:
        old_status = issue.status
        issue.status = update_in.status
        log_activity(
            db, workspace.id, membership.user_id, "updated_status", issue.id, "status",
            old_status, update_in.status,
            notify_user_id=issue.assignee_id,
            notification_title=f"Status changed: {issue.sequence_id}",
            notification_message=f"{membership.user.full_name} moved '{issue.title}' from {old_status} to {update_in.status}"
        )

    if update_in.priority is not None and update_in.priority != issue.priority:
        old_prio = issue.priority
        issue.priority = update_in.priority
        log_activity(db, workspace.id, membership.user_id, "updated_priority", issue.id, "priority", old_prio, update_in.priority)

    if update_in.order is not None:
        issue.order = update_in.order

    if update_in.assignee_id is not None and update_in.assignee_id != issue.assignee_id:
        old_assignee_id = issue.assignee_id
        issue.assignee_id = update_in.assignee_id if update_in.assignee_id != "" else None
        new_assignee_user = db.query(User).filter(User.id == issue.assignee_id).first() if issue.assignee_id else None
        new_name = new_assignee_user.full_name if new_assignee_user else "Unassigned"
        log_activity(
            db, workspace.id, membership.user_id, "assigned", issue.id, "assignee",
            str(old_assignee_id), new_name,
            notify_user_id=issue.assignee_id,
            notification_title=f"Assigned to: {issue.sequence_id}",
            notification_message=f"{membership.user.full_name} assigned you to '{issue.title}'"
        )

    if update_in.cycle_id is not None:
        issue.cycle_id = update_in.cycle_id if update_in.cycle_id != "" else None

    if update_in.due_date is not None:
        issue.due_date = update_in.due_date

    if update_in.estimate_points is not None:
        issue.estimate_points = update_in.estimate_points

    if update_in.label_ids is not None:
        labels = db.query(Label).filter(
            Label.id.in_(update_in.label_ids),
            Label.workspace_id == workspace.id
        ).all()
        issue.labels = labels

    db.commit()
    db.refresh(issue)
    return serialize_issue(issue, db)

@router.delete("/{issue_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_issue(
    issue_id: str,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, _ = context
    issue = db.query(Issue).filter(
        Issue.id == issue_id,
        Issue.workspace_id == workspace.id
    ).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    db.delete(issue)
    db.commit()
    return None
