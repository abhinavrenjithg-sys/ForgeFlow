from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from backend.app.schemas.user import UserResponse

class WorkspaceBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    slug: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class WorkspaceMembershipResponse(BaseModel):
    id: str
    workspace_id: str
    user_id: str
    role: str
    created_at: datetime
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class WorkspaceMemberAdd(BaseModel):
    email: str
    role: str = "member"

class WorkspaceMemberUpdate(BaseModel):
    role: str

class WorkspaceResponse(WorkspaceBase):
    id: str
    owner_id: str
    created_at: datetime
    updated_at: datetime
    current_user_role: Optional[str] = None
    members_count: Optional[int] = None
    projects_count: Optional[int] = None

    class Config:
        from_attributes = True
