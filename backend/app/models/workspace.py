from sqlalchemy import Column, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.app.models.base import TimeStampedModel

class Workspace(TimeStampedModel):
    __tablename__ = "workspaces"

    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(String(500), nullable=True)
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    owner = relationship("User", foreign_keys=[owner_id])
    memberships = relationship("WorkspaceMembership", back_populates="workspace", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="workspace", cascade="all, delete-orphan")
    labels = relationship("Label", back_populates="workspace", cascade="all, delete-orphan")
    issues = relationship("Issue", back_populates="workspace", cascade="all, delete-orphan")
    activity_events = relationship("ActivityEvent", back_populates="workspace", cascade="all, delete-orphan")

class WorkspaceMembership(TimeStampedModel):
    __tablename__ = "workspace_memberships"

    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(20), default="member", nullable=False)  # admin, member, viewer

    __table_args__ = (
        UniqueConstraint("workspace_id", "user_id", name="uq_workspace_user"),
    )

    workspace = relationship("Workspace", back_populates="memberships")
    user = relationship("User", back_populates="workspace_memberships")
