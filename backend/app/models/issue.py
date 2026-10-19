from sqlalchemy import Column, String, ForeignKey, Integer, Float, Date, Text, Table, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.app.models.base import TimeStampedModel, Base

issue_labels = Table(
    "issue_labels",
    Base.metadata,
    Column("issue_id", String(36), ForeignKey("issues.id", ondelete="CASCADE"), primary_key=True),
    Column("label_id", String(36), ForeignKey("labels.id", ondelete="CASCADE"), primary_key=True),
)

class Label(TimeStampedModel):
    __tablename__ = "labels"

    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(50), nullable=False)
    color_hex = Column(String(20), default="#84CC16", nullable=False)

    __table_args__ = (
        UniqueConstraint("workspace_id", "name", name="uq_workspace_label_name"),
    )

    workspace = relationship("Workspace", back_populates="labels")
    issues = relationship("Issue", secondary=issue_labels, back_populates="labels")

class Issue(TimeStampedModel):
    __tablename__ = "issues"

    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    sequence_id = Column(String(30), nullable=False, index=True)  # e.g., FORGE-101
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(30), default="todo", nullable=False, index=True)  # backlog, todo, in_progress, in_review, done, cancelled
    priority = Column(String(20), default="medium", nullable=False, index=True)  # urgent, high, medium, low, none
    order = Column(Float, default=1000.0, nullable=False)  # For sorting within a Kanban column
    
    assignee_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    reporter_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    cycle_id = Column(String(36), ForeignKey("cycles.id", ondelete="SET NULL"), nullable=True, index=True)
    parent_issue_id = Column(String(36), ForeignKey("issues.id", ondelete="SET NULL"), nullable=True, index=True)
    
    due_date = Column(Date, nullable=True)
    estimate_points = Column(Integer, nullable=True)

    __table_args__ = (
        UniqueConstraint("project_id", "sequence_id", name="uq_project_issue_sequence"),
    )

    # Relationships
    workspace = relationship("Workspace", back_populates="issues")
    project = relationship("Project", back_populates="issues")
    assignee = relationship("User", foreign_keys=[assignee_id], back_populates="assigned_issues")
    reporter = relationship("User", foreign_keys=[reporter_id], back_populates="reported_issues")
    cycle = relationship("Cycle", back_populates="issues")
    
    parent_issue = relationship("Issue", remote_side="Issue.id", backref="subtasks")
    labels = relationship("Label", secondary=issue_labels, back_populates="issues")
    comments = relationship("Comment", back_populates="issue", cascade="all, delete-orphan", order_by="Comment.created_at.asc()")
    activity_events = relationship("ActivityEvent", back_populates="issue", cascade="all, delete-orphan", order_by="ActivityEvent.created_at.desc()")

class Comment(TimeStampedModel):
    __tablename__ = "comments"

    issue_id = Column(String(36), ForeignKey("issues.id", ondelete="CASCADE"), nullable=False, index=True)
    author_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    content = Column(Text, nullable=False)

    issue = relationship("Issue", back_populates="comments")
    author = relationship("User", back_populates="comments")
