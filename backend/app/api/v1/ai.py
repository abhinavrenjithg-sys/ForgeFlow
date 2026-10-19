from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.app.core.database import get_db
from backend.app.models.project import Project
from backend.app.models.issue import Issue, Label
from backend.app.schemas.ai import (
    AITaskPlanRequest, AITaskPlanResponse,
    AICommitTasksRequest, AICommitTasksResponse
)
from backend.app.api.deps import get_workspace_membership
from backend.app.services.ai_planner import ai_planner
from backend.app.services.activity_service import log_activity

router = APIRouter(prefix="/workspaces/{slug}/ai", tags=["AI Task Planner"])

@router.post("/plan", response_model=AITaskPlanResponse)
def plan_tasks(
    request: AITaskPlanRequest,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, _ = context
    project = db.query(Project).filter(
        Project.id == request.project_id,
        Project.workspace_id == workspace.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found in this workspace")

    # Get sample context from existing issues in project to inform AI
    recent_issues = db.query(Issue.title).filter(Issue.project_id == project.id).limit(5).all()
    context_str = ", ".join([i[0] for i in recent_issues]) if recent_issues else "New project"

    plan = ai_planner.generate_plan(
        prompt=request.prompt,
        project_name=project.name,
        existing_tasks_context=context_str
    )
    return plan

@router.post("/plan/commit", response_model=AICommitTasksResponse)
def commit_planned_tasks(
    commit_req: AICommitTasksRequest,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, membership = context
    project = db.query(Project).filter(
        Project.id == commit_req.project_id,
        Project.workspace_id == workspace.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found in this workspace")

    if not commit_req.tasks:
        raise HTTPException(status_code=400, detail="No tasks provided for commit")

    created_ids = []
    
    # Process each confirmed task
    for task_item in commit_req.tasks:
        issue_num = project.next_issue_number
        project.next_issue_number += 1
        sequence_id = f"{project.identifier}-{issue_num}"

        # Build rich description including subtasks and acceptance criteria
        desc_parts = [task_item.description or ""]
        if task_item.subtasks:
            desc_parts.append("\n\n### Subtasks\n" + "\n".join([f"- [ ] {st}" for st in task_item.subtasks]))
        if task_item.acceptance_criteria:
            desc_parts.append("\n\n### Acceptance Criteria\n" + "\n".join([f"- [ ] {ac}" for ac in task_item.acceptance_criteria]))
        full_description = "".join(desc_parts).strip()

        issue = Issue(
            workspace_id=workspace.id,
            project_id=project.id,
            sequence_id=sequence_id,
            title=task_item.title.strip(),
            description=full_description,
            status=task_item.status or "todo",
            priority=task_item.priority or "medium",
            order=float(issue_num * 1000),
            reporter_id=membership.user_id
        )

        # Labels
        if task_item.labels:
            matched_labels = []
            for label_name in task_item.labels:
                lbl = db.query(Label).filter(
                    Label.workspace_id == workspace.id,
                    Label.name == label_name.strip()
                ).first()
                if not lbl:
                    lbl = Label(workspace_id=workspace.id, name=label_name.strip(), color_hex="#84CC16")
                    db.add(lbl)
                    db.flush()
                matched_labels.append(lbl)
            issue.labels = matched_labels

        db.add(issue)
        db.flush()
        created_ids.append(issue.id)

    log_activity(
        db=db,
        workspace_id=workspace.id,
        actor_id=membership.user_id,
        verb="ai_planned_batch",
        field_name="project",
        new_value=f"Generated {len(created_ids)} tasks for {project.name}"
    )
    db.commit()

    return AICommitTasksResponse(
        created_count=len(created_ids),
        message=f"Successfully committed {len(created_ids)} AI-planned tasks to {project.name}",
        created_issue_ids=created_ids
    )
