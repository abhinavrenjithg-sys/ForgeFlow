from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.app.core.database import get_db
from backend.app.models.notification import Notification
from backend.app.schemas.activity import NotificationResponse
from backend.app.api.deps import get_workspace_membership

router = APIRouter(prefix="/workspaces/{slug}/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
def get_user_notifications(
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, membership = context
    notifs = db.query(Notification).filter(
        Notification.workspace_id == workspace.id,
        Notification.recipient_id == membership.user_id
    ).order_by(Notification.created_at.desc()).limit(30).all()
    return [NotificationResponse.model_validate(n) for n in notifs]

@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(
    notification_id: str,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, membership = context
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.recipient_id == membership.user_id,
        Notification.workspace_id == workspace.id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return NotificationResponse.model_validate(notif)

@router.post("/mark-all-read", status_code=status.HTTP_200_OK)
def mark_all_notifications_read(
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, membership = context
    db.query(Notification).filter(
        Notification.workspace_id == workspace.id,
        Notification.recipient_id == membership.user_id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}
