from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from backend.app.schemas.user import UserResponse

class CycleBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: str = "upcoming"

class CycleCreate(CycleBase):
    pass

class CycleResponse(CycleBase):
    id: str
    project_id: str
    created_at: datetime
    issues_count: Optional[int] = 0

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    identifier: str = Field(..., min_length=2, max_length=10)
    description: Optional[str] = None
    status: str = "in_progress"
    lead_id: Optional[str] = None
    start_date: Optional[date] = None
    target_date: Optional[date] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    lead_id: Optional[str] = None
    start_date: Optional[date] = None
    target_date: Optional[date] = None

class ProjectResponse(ProjectBase):
    id: str
    workspace_id: str
    next_issue_number: int
    created_at: datetime
    updated_at: datetime
    lead: Optional[UserResponse] = None
    issues_count: Optional[int] = 0
    completed_issues_count: Optional[int] = 0

    class Config:
        from_attributes = True
