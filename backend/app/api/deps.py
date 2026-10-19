from typing import Generator, Optional, Tuple, List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.security import decode_access_token
from backend.app.models.user import User
from backend.app.models.workspace import Workspace, WorkspaceMembership

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    auto_error=False
)

def get_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(reusable_oauth2)
) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials or token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found or account is deactivated"
        )
    return user

def get_workspace_membership(
    slug: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Tuple[Workspace, WorkspaceMembership]:
    workspace = db.query(Workspace).filter(Workspace.slug == slug).first()
    if not workspace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workspace '{slug}' not found"
        )
    membership = db.query(WorkspaceMembership).filter(
        WorkspaceMembership.workspace_id == workspace.id,
        WorkspaceMembership.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You are not a member of this workspace"
        )
    return workspace, membership

def require_admin_membership(
    context: Tuple[Workspace, WorkspaceMembership] = Depends(get_workspace_membership)
) -> Tuple[Workspace, WorkspaceMembership]:
    workspace, membership = context
    if membership.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Workspace admin permissions required for this action"
        )
    return workspace, membership
