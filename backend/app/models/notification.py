from sqlalchemy import Column, String, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from backend.app.models.base import TimeStampedModel

class Notification(TimeStampedModel):
    __tablename__ = "notifications"

    recipient_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    issue_id = Column(String(36), ForeignKey("issues.id", ondelete="CASCADE"), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False, index=True)

    recipient = relationship("User", back_populates="notifications")
    workspace = relationship("Workspace")
    issue = relationship("Issue")
