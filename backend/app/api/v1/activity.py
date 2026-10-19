from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app.core.database import get_db
from backend.app.models.activity import ActivityEvent
from backend.app.schemas.activity import ActivityEventResponse
from backend.app.schemas.user import UserResponse
from backend.app.api.deps import get_workspace_membership

router = APIRouter(prefix="/workspaces/{slug}/activity", tags=["Activity"])

@router.get("", response_model=List[ActivityEventResponse])
def get_workspace_activity(
    limit: int = Query(50, ge=1, le=100),
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, _ = context
    events = db.query(ActivityEvent).filter(
        ActivityEvent.workspace_id == workspace.id
    ).order_by(ActivityEvent.created_at.desc()).limit(limit).all()

    results = []
    for e in events:
        resp = ActivityEventResponse.model_validate(e)
        resp.actor = UserResponse.model_validate(e.actor) if e.actor else None
        results.append(resp)
    return results

@router.get("/issue/{issue_id}", response_model=List[ActivityEventResponse])
def get_issue_activity(
    issue_id: str,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, _ = context
    events = db.query(ActivityEvent).filter(
        ActivityEvent.workspace_id == workspace.id,
        ActivityEvent.issue_id == issue_id
    ).order_by(ActivityEvent.created_at.desc()).all()

    results = []
    for e in events:
        resp = ActivityEventResponse.model_validate(e)
        resp.actor = UserResponse.model_validate(e.actor) if e.actor else None
        results.append(resp)
    return results
