from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.app.core.database import get_db
from backend.app.models.project import Project, Cycle
from backend.app.models.issue import Issue
from backend.app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, CycleCreate, CycleResponse
from backend.app.schemas.user import UserResponse
from backend.app.api.deps import get_workspace_membership
from backend.app.services.activity_service import log_activity

router = APIRouter(prefix="/workspaces/{slug}/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse])
def list_projects(
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, _ = context
    projects = db.query(Project).filter(Project.workspace_id == workspace.id).all()
    results = []
    for p in projects:
        resp = ProjectResponse.model_validate(p)
        resp.lead = UserResponse.model_validate(p.lead) if p.lead else None
        resp.issues_count = db.query(Issue).filter(Issue.project_id == p.id).count()
        resp.completed_issues_count = db.query(Issue).filter(Issue.project_id == p.id, Issue.status == "done").count()
        results.append(resp)
    return results

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, membership = context
    identifier = project_in.identifier.upper().strip()

    # Check identifier uniqueness in workspace
    existing = db.query(Project).filter(
        Project.workspace_id == workspace.id,
        Project.identifier == identifier
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Project with identifier '{identifier}' already exists in this workspace"
        )

    project = Project(
        workspace_id=workspace.id,
        name=project_in.name.strip(),
        identifier=identifier,
        description=project_in.description,
        status=project_in.status,
        lead_id=project_in.lead_id or membership.user_id,
        start_date=project_in.start_date,
        target_date=project_in.target_date,
        next_issue_number=1
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    log_activity(
        db=db,
        workspace_id=workspace.id,
        actor_id=membership.user_id,
        verb="created_project",
        field_name="project",
        new_value=project.name
    )
    db.commit()

    resp = ProjectResponse.model_validate(project)
    resp.lead = UserResponse.model_validate(project.lead) if project.lead else None
    resp.issues_count = 0
    resp.completed_issues_count = 0
    return resp

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: str,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, _ = context
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.workspace_id == workspace.id
    ).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found in this workspace"
        )

    resp = ProjectResponse.model_validate(project)
    resp.lead = UserResponse.model_validate(project.lead) if project.lead else None
    resp.issues_count = db.query(Issue).filter(Issue.project_id == project.id).count()
    resp.completed_issues_count = db.query(Issue).filter(Issue.project_id == project.id, Issue.status == "done").count()
    return resp

@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: str,
    update_in: ProjectUpdate,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, _ = context
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.workspace_id == workspace.id
    ).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found in this workspace"
        )

    if update_in.name is not None:
        project.name = update_in.name.strip()
    if update_in.description is not None:
        project.description = update_in.description
    if update_in.status is not None:
        project.status = update_in.status
    if update_in.lead_id is not None:
        project.lead_id = update_in.lead_id
    if update_in.start_date is not None:
        project.start_date = update_in.start_date
    if update_in.target_date is not None:
        project.target_date = update_in.target_date

    db.commit()
    db.refresh(project)

    resp = ProjectResponse.model_validate(project)
    resp.lead = UserResponse.model_validate(project.lead) if project.lead else None
    resp.issues_count = db.query(Issue).filter(Issue.project_id == project.id).count()
    resp.completed_issues_count = db.query(Issue).filter(Issue.project_id == project.id, Issue.status == "done").count()
    return resp

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: str,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, membership = context
    if membership.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only workspace admins can delete projects"
        )

    project = db.query(Project).filter(
        Project.id == project_id,
        Project.workspace_id == workspace.id
    ).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    db.delete(project)
    db.commit()
    return None

# Cycles
@router.get("/{project_id}/cycles", response_model=List[CycleResponse])
def list_project_cycles(
    project_id: str,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, _ = context
    project = db.query(Project).filter(Project.id == project_id, Project.workspace_id == workspace.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    cycles = db.query(Cycle).filter(Cycle.project_id == project_id).all()
    results = []
    for c in cycles:
        resp = CycleResponse.model_validate(c)
        resp.issues_count = db.query(Issue).filter(Issue.cycle_id == c.id).count()
        results.append(resp)
    return results

@router.post("/{project_id}/cycles", response_model=CycleResponse, status_code=status.HTTP_201_CREATED)
def create_project_cycle(
    project_id: str,
    cycle_in: CycleCreate,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, _ = context
    project = db.query(Project).filter(Project.id == project_id, Project.workspace_id == workspace.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    cycle = Cycle(
        project_id=project_id,
        name=cycle_in.name.strip(),
        description=cycle_in.description,
        start_date=cycle_in.start_date,
        end_date=cycle_in.end_date,
        status=cycle_in.status
    )
    db.add(cycle)
    db.commit()
    db.refresh(cycle)

    resp = CycleResponse.model_validate(cycle)
    resp.issues_count = 0
    return resp
