from typing import Optional
from sqlalchemy.orm import Session
from backend.app.models.activity import ActivityEvent
from backend.app.models.notification import Notification
from backend.app.models.issue import Issue

def log_activity(
    db: Session,
    workspace_id: str,
    actor_id: str,
    verb: str,
    issue_id: Optional[str] = None,
    field_name: Optional[str] = None,
    old_value: Optional[str] = None,
    new_value: Optional[str] = None,
    notify_user_id: Optional[str] = None,
    notification_title: Optional[str] = None,
    notification_message: Optional[str] = None
) -> ActivityEvent:
    event = ActivityEvent(
        workspace_id=workspace_id,
        issue_id=issue_id,
        actor_id=actor_id,
        verb=verb,
        field_name=field_name,
        old_value=str(old_value) if old_value is not None else None,
        new_value=str(new_value) if new_value is not None else None
    )
    db.add(event)

    # Optional in-app notification dispatch if someone else is affected
    if notify_user_id and notify_user_id != actor_id and notification_title and notification_message:
        notif = Notification(
            recipient_id=notify_user_id,
            workspace_id=workspace_id,
            issue_id=issue_id,
            title=notification_title,
            message=notification_message,
            is_read=False
        )
        db.add(notif)

    return event
