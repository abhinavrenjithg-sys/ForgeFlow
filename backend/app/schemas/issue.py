from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from backend.app.schemas.user import UserResponse

class LabelBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    color_hex: str = "#84CC16"

class LabelCreate(LabelBase):
    pass

class LabelResponse(LabelBase):
    id: str
    workspace_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class CommentBase(BaseModel):
    content: str = Field(..., min_length=1)

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: str
    issue_id: str
    author_id: str
    created_at: datetime
    updated_at: datetime
    author: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class IssueBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    status: str = "todo"
    priority: str = "medium"
    order: Optional[float] = 1000.0
    assignee_id: Optional[str] = None
    cycle_id: Optional[str] = None
    parent_issue_id: Optional[str] = None
    due_date: Optional[date] = None
    estimate_points: Optional[int] = None

class IssueCreate(IssueBase):
    project_id: str
    label_ids: Optional[List[str]] = []

class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    order: Optional[float] = None
    assignee_id: Optional[str] = None
    cycle_id: Optional[str] = None
    parent_issue_id: Optional[str] = None
    due_date: Optional[date] = None
    estimate_points: Optional[int] = None
    label_ids: Optional[List[str]] = None

class IssueSimpleResponse(BaseModel):
    id: str
    sequence_id: str
    title: str
    status: str
    priority: str

    class Config:
        from_attributes = True

class IssueResponse(IssueBase):
    id: str
    workspace_id: str
    project_id: str
    sequence_id: str
    reporter_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    assignee: Optional[UserResponse] = None
    reporter: Optional[UserResponse] = None
    labels: List[LabelResponse] = []
    comments_count: Optional[int] = 0
    subtasks_count: Optional[int] = 0

    class Config:
        from_attributes = True
