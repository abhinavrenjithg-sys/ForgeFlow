from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.app.core.database import get_db
from backend.app.models.issue import Label
from backend.app.schemas.issue import LabelCreate, LabelResponse
from backend.app.api.deps import get_workspace_membership

router = APIRouter(prefix="/workspaces/{slug}/labels", tags=["Labels"])

@router.get("", response_model=List[LabelResponse])
def list_labels(
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, _ = context
    labels = db.query(Label).filter(Label.workspace_id == workspace.id).all()
    return [LabelResponse.model_validate(l) for l in labels]

@router.post("", response_model=LabelResponse, status_code=status.HTTP_201_CREATED)
def create_label(
    label_in: LabelCreate,
    context=Depends(get_workspace_membership),
    db: Session = Depends(get_db)
):
    workspace, _ = context
    name = label_in.name.strip()
    existing = db.query(Label).filter(
        Label.workspace_id == workspace.id,
        Label.name == name
    ).first()
    if existing:
        return LabelResponse.model_validate(existing)

    label = Label(
        workspace_id=workspace.id,
        name=name,
        color_hex=label_in.color_hex or "#84CC16"
    )
    db.add(label)
    db.commit()
    db.refresh(label)
    return LabelResponse.model_validate(label)
