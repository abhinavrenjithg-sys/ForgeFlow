from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.app.core.database import get_db
from backend.app.models.issue import Issue
from backend.app.models.project import Project
from backend.app.models.user import User
from backend.app.models.workspace import WorkspaceMembership
from backend.app.schemas.analytics import AnalyticsResponse, AssigneeWorkload, ProjectProgress
from backend.app.api.deps import get_workspace_membership

router = APIRouter(prefix="/workspaces/{slug}/analytics", tags=["Analytics"])

@router.get("", response_model=AnalyticsResponse)
def get_workspace_analytics(
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, _ = context
    today = date.today()

    total_issues = db.query(Issue).filter(Issue.workspace_id == workspace.id).count()
    completed_issues = db.query(Issue).filter(Issue.workspace_id == workspace.id, Issue.status == "done").count()
    open_issues = db.query(Issue).filter(
        Issue.workspace_id == workspace.id,
        Issue.status.notin_(["done", "cancelled"])
    ).count()

    overdue_issues = db.query(Issue).filter(
        Issue.workspace_id == workspace.id,
        Issue.status.notin_(["done", "cancelled"]),
        Issue.due_date.isnot(None),
        Issue.due_date < today
    ).count()

    completion_rate = round((completed_issues / total_issues * 100), 1) if total_issues > 0 else 0.0

    # Group by status
    status_counts = {"backlog": 0, "todo": 0, "in_progress": 0, "in_review": 0, "done": 0, "cancelled": 0}
    status_query = db.query(Issue.status, func.count(Issue.id)).filter(
        Issue.workspace_id == workspace.id
    ).group_by(Issue.status).all()
    for st, count in status_query:
        if st in status_counts:
            status_counts[st] = count
        else:
            status_counts[st] = count

    # Group by priority
    priority_counts = {"urgent": 0, "high": 0, "medium": 0, "low": 0, "none": 0}
    prio_query = db.query(Issue.priority, func.count(Issue.id)).filter(
        Issue.workspace_id == workspace.id
    ).group_by(Issue.priority).all()
    for pr, count in prio_query:
        if pr in priority_counts:
            priority_counts[pr] = count
        else:
            priority_counts[pr] = count

    # Workload by assignee
    workloads = []
    memberships = db.query(WorkspaceMembership).filter(WorkspaceMembership.workspace_id == workspace.id).all()
    for m in memberships:
        u = m.user
        u_total = db.query(Issue).filter(Issue.workspace_id == workspace.id, Issue.assignee_id == u.id).count()
        u_done = db.query(Issue).filter(Issue.workspace_id == workspace.id, Issue.assignee_id == u.id, Issue.status == "done").count()
        workloads.append(AssigneeWorkload(
            user_id=u.id,
            full_name=u.full_name,
            avatar_url=u.avatar_url,
            total_issues=u_total,
            completed_issues=u_done
        ))

    # Project progress
    projects_progress = []
    projects = db.query(Project).filter(Project.workspace_id == workspace.id).all()
    for p in projects:
        p_total = db.query(Issue).filter(Issue.project_id == p.id).count()
        p_done = db.query(Issue).filter(Issue.project_id == p.id, Issue.status == "done").count()
        p_rate = round((p_done / p_total * 100), 1) if p_total > 0 else 0.0
        projects_progress.append(ProjectProgress(
            project_id=p.id,
            name=p.name,
            identifier=p.identifier,
            total_issues=p_total,
            completed_issues=p_done,
            completion_rate=p_rate
        ))

    return AnalyticsResponse(
        total_issues=total_issues,
        open_issues=open_issues,
        completed_issues=completed_issues,
        overdue_issues=overdue_issues,
        completion_rate=completion_rate,
        issues_by_status=status_counts,
        issues_by_priority=priority_counts,
        workload_by_assignee=workloads,
        project_progress=projects_progress
    )
