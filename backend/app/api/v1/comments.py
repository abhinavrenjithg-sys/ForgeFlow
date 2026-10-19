from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.app.core.database import get_db
from backend.app.models.issue import Issue, Comment
from backend.app.schemas.issue import CommentCreate, CommentResponse
from backend.app.schemas.user import UserResponse
from backend.app.api.deps import get_workspace_membership
from backend.app.services.activity_service import log_activity

router = APIRouter(prefix="/workspaces/{slug}/issues/{issue_id}/comments", tags=["Comments"])

@router.get("", response_model=List[CommentResponse])
def list_comments(
    issue_id: str,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, _ = context
    issue = db.query(Issue).filter(Issue.id == issue_id, Issue.workspace_id == workspace.id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found in this workspace")

    comments = db.query(Comment).filter(Comment.issue_id == issue.id).order_by(Comment.created_at.asc()).all()
    results = []
    for c in comments:
        resp = CommentResponse.model_validate(c)
        resp.author = UserResponse.model_validate(c.author)
        results.append(resp)
    return results

@router.post("", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    issue_id: str,
    comment_in: CommentCreate,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, membership = context
    issue = db.query(Issue).filter(Issue.id == issue_id, Issue.workspace_id == workspace.id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found in this workspace")

    comment = Comment(
        issue_id=issue.id,
        author_id=membership.user_id,
        content=comment_in.content.strip()
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    # Log activity & notify assignee if not the author
    log_activity(
        db=db,
        workspace_id=workspace.id,
        actor_id=membership.user_id,
        verb="commented",
        issue_id=issue.id,
        field_name="comment",
        new_value=comment.content[:80],
        notify_user_id=issue.assignee_id,
        notification_title=f"New comment on {issue.sequence_id}",
        notification_message=f"{membership.user.full_name}: {comment.content[:100]}"
    )
    db.commit()

    resp = CommentResponse.model_validate(comment)
    resp.author = UserResponse.model_validate(comment.author)
    return resp
