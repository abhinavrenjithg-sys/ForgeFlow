from sqlalchemy import Column, String, ForeignKey, Integer, Date, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.app.models.base import TimeStampedModel

class Project(TimeStampedModel):
    __tablename__ = "projects"

    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    identifier = Column(String(10), nullable=False)  # e.g., FORGE, API
    description = Column(Text, nullable=True)
    status = Column(String(30), default="in_progress", nullable=False)  # planned, in_progress, paused, completed, archived
    lead_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    start_date = Column(Date, nullable=True)
    target_date = Column(Date, nullable=True)
    next_issue_number = Column(Integer, default=1, nullable=False)

    __table_args__ = (
        UniqueConstraint("workspace_id", "identifier", name="uq_project_identifier_per_workspace"),
    )

    # Relationships
    workspace = relationship("Workspace", back_populates="projects")
    lead = relationship("User", foreign_keys=[lead_id])
    memberships = relationship("ProjectMembership", back_populates="project", cascade="all, delete-orphan")
    cycles = relationship("Cycle", back_populates="project", cascade="all, delete-orphan")
    issues = relationship("Issue", back_populates="project", cascade="all, delete-orphan")

class ProjectMembership(TimeStampedModel):
    __tablename__ = "project_memberships"

    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(20), default="member", nullable=False)

    __table_args__ = (
        UniqueConstraint("project_id", "user_id", name="uq_project_user"),
    )

    project = relationship("Project", back_populates="memberships")
    user = relationship("User")

class Cycle(TimeStampedModel):
    __tablename__ = "cycles"

    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    status = Column(String(20), default="upcoming", nullable=False)  # upcoming, active, completed

    project = relationship("Project", back_populates="cycles")
    issues = relationship("Issue", back_populates="cycle")
