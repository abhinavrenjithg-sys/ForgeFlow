from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.workspace import Workspace, WorkspaceMembership
from backend.app.models.project import Project
from backend.app.schemas.workspace import (
    WorkspaceCreate, WorkspaceUpdate, WorkspaceResponse,
    WorkspaceMembershipResponse, WorkspaceMemberAdd, WorkspaceMemberUpdate
)
from backend.app.schemas.user import UserResponse
from backend.app.api.deps import get_current_user, get_workspace_membership, require_admin_membership

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])

@router.get("", response_model=List[WorkspaceResponse])
def list_user_workspaces(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    memberships = db.query(WorkspaceMembership).filter(WorkspaceMembership.user_id == current_user.id).all()
    results = []
    for m in memberships:
        ws = m.workspace
        resp = WorkspaceResponse.model_validate(ws)
        resp.current_user_role = m.role
        resp.members_count = db.query(WorkspaceMembership).filter(WorkspaceMembership.workspace_id == ws.id).count()
        resp.projects_count = db.query(Project).filter(Project.workspace_id == ws.id).count()
        results.append(resp)
    return results

@router.post("", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
def create_workspace(
    ws_in: WorkspaceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    slug = ws_in.slug.lower().strip()
    if db.query(Workspace).filter(Workspace.slug == slug).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Workspace with slug '{slug}' already exists. Please pick another unique identifier."
        )

    workspace = Workspace(
        name=ws_in.name.strip(),
        slug=slug,
        description=ws_in.description,
        owner_id=current_user.id
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)

    membership = WorkspaceMembership(
        workspace_id=workspace.id,
        user_id=current_user.id,
        role="admin"
    )
    db.add(membership)
    db.commit()

    resp = WorkspaceResponse.model_validate(workspace)
    resp.current_user_role = "admin"
    resp.members_count = 1
    resp.projects_count = 0
    return resp

@router.get("/{slug}", response_model=WorkspaceResponse)
def get_workspace_by_slug(
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, membership = context
    resp = WorkspaceResponse.model_validate(workspace)
    resp.current_user_role = membership.role
    resp.members_count = db.query(WorkspaceMembership).filter(WorkspaceMembership.workspace_id == workspace.id).count()
    resp.projects_count = db.query(Project).filter(Project.workspace_id == workspace.id).count()
    return resp

@router.patch("/{slug}", response_model=WorkspaceResponse)
def update_workspace(
    update_in: WorkspaceUpdate,
    context=Depends(require_admin_membership),
    db: Session = Depends(get_db)
):
    workspace, membership = context
    if update_in.name is not None:
        workspace.name = update_in.name.strip()
    if update_in.description is not None:
        workspace.description = update_in.description
    db.commit()
    db.refresh(workspace)

    resp = WorkspaceResponse.model_validate(workspace)
    resp.current_user_role = membership.role
    return resp

@router.get("/{slug}/members", response_model=List[WorkspaceMembershipResponse])
def list_workspace_members(
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, _ = context
    memberships = db.query(WorkspaceMembership).filter(WorkspaceMembership.workspace_id == workspace.id).all()
    results = []
    for m in memberships:
        user_resp = UserResponse.model_validate(m.user)
        results.append(WorkspaceMembershipResponse(
            id=m.id,
            workspace_id=m.workspace_id,
            user_id=m.user_id,
            role=m.role,
            created_at=m.created_at,
            user=user_resp
        ))
    return results

@router.post("/{slug}/members", response_model=WorkspaceMembershipResponse, status_code=status.HTTP_201_CREATED)
def add_workspace_member(
    member_in: WorkspaceMemberAdd,
    context=Depends(require_admin_membership),
    db: Session = Depends(get_db)
):
    workspace, _ = context
    target_user = db.query(User).filter(User.email == member_in.email.lower().strip()).first()
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with email '{member_in.email}' not found. Ask them to register first."
        )

    existing = db.query(WorkspaceMembership).filter(
        WorkspaceMembership.workspace_id == workspace.id,
        WorkspaceMembership.user_id == target_user.id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member of this workspace"
        )

    membership = WorkspaceMembership(
        workspace_id=workspace.id,
        user_id=target_user.id,
        role=member_in.role if member_in.role in ["admin", "member", "viewer"] else "member"
    )
    db.add(membership)
    db.commit()
    db.refresh(membership)

    return WorkspaceMembershipResponse(
        id=membership.id,
        workspace_id=membership.workspace_id,
        user_id=membership.user_id,
        role=membership.role,
        created_at=membership.created_at,
        user=UserResponse.model_validate(target_user)
    )
