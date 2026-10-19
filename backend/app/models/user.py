from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from backend.app.models.base import TimeStampedModel

class User(TimeStampedModel):
    __tablename__ = "users"

    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    avatar_url = Column(String(512), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    workspace_memberships = relationship("WorkspaceMembership", back_populates="user", cascade="all, delete-orphan")
    assigned_issues = relationship("Issue", foreign_keys="[Issue.assignee_id]", back_populates="assignee")
    reported_issues = relationship("Issue", foreign_keys="[Issue.reporter_id]", back_populates="reporter")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="recipient", cascade="all, delete-orphan")
    activity_events = relationship("ActivityEvent", back_populates="actor")
