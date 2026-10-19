from sqlalchemy import Column, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.models.base import TimeStampedModel

class ActivityEvent(TimeStampedModel):
    __tablename__ = "activity_events"

    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    issue_id = Column(String(36), ForeignKey("issues.id", ondelete="CASCADE"), nullable=True, index=True)
    actor_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    verb = Column(String(50), nullable=False)  # created, updated_status, updated_priority, assigned, commented, etc.
    field_name = Column(String(50), nullable=True)
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)

    workspace = relationship("Workspace", back_populates="activity_events")
    issue = relationship("Issue", back_populates="activity_events")
    actor = relationship("User", back_populates="activity_events")
