from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from backend.app.schemas.user import UserResponse

class ActivityEventResponse(BaseModel):
    id: str
    workspace_id: str
    issue_id: Optional[str] = None
    actor_id: str
    verb: str
    field_name: Optional[str] = None
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    created_at: datetime
    actor: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: str
    recipient_id: str
    workspace_id: str
    issue_id: Optional[str] = None
    title: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
