import os
import sys
from datetime import datetime, timezone, timedelta, date

# Ensure root is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.core.database import SessionLocal, Base, engine
from backend.app.core.security import get_password_hash
from backend.app.models.user import User
from backend.app.models.workspace import Workspace, WorkspaceMembership
from backend.app.models.project import Project, ProjectMembership, Cycle
from backend.app.models.issue import Issue, Label, Comment
from backend.app.models.activity import ActivityEvent
from backend.app.models.notification import Notification

def seed():
    print("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        existing_user = db.query(User).filter(User.email == "alex@forgeflow.io").first()
        if existing_user:
            print("Database already contains demo user 'alex@forgeflow.io'. Skipping re-seed.")
            return

        print("Seeding demo users...")
        hashed_pwd = get_password_hash("password123")

        alex = User(
            email="alex@forgeflow.io",
            full_name="Alex Mercer",
            hashed_password=hashed_pwd,
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            is_active=True
        )
        sarah = User(
            email="sarah@forgeflow.io",
            full_name="Sarah Chen",
            hashed_password=hashed_pwd,
            avatar_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
            is_active=True
        )
        marcus = User(
            email="marcus@forgeflow.io",
            full_name="Marcus Vance",
            hashed_password=hashed_pwd,
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            is_active=True
        )
        db.add_all([alex, sarah, marcus])
        db.commit()

        print("Seeding workspace 'Forge Labs'...")
        workspace = Workspace(
            name="Forge Labs",
            slug="forge-labs",
            description="High-velocity product engineering team building next-generation infrastructure",
            owner_id=alex.id
        )
        db.add(workspace)
        db.commit()

        # Memberships
        m_alex = WorkspaceMembership(workspace_id=workspace.id, user_id=alex.id, role="admin")
        m_sarah = WorkspaceMembership(workspace_id=workspace.id, user_id=sarah.id, role="member")
        m_marcus = WorkspaceMembership(workspace_id=workspace.id, user_id=marcus.id, role="member")
        db.add_all([m_alex, m_sarah, m_marcus])
        db.commit()

        print("Seeding labels...")
        lbl_fe = Label(workspace_id=workspace.id, name="Frontend", color_hex="#38BDF8")
        lbl_be = Label(workspace_id=workspace.id, name="Backend", color_hex="#84CC16")
        lbl_db = Label(workspace_id=workspace.id, name="Database", color_hex="#A855F7")
        lbl_sec = Label(workspace_id=workspace.id, name="Security", color_hex="#EF4444")
        lbl_ux = Label(workspace_id=workspace.id, name="UI/UX", color_hex="#F59E0B")
        lbl_ai = Label(workspace_id=workspace.id, name="AI / ML", color_hex="#10B981")
        db.add_all([lbl_fe, lbl_be, lbl_db, lbl_sec, lbl_ux, lbl_ai])
        db.commit()

        print("Seeding projects...")
        proj_core = Project(
            workspace_id=workspace.id,
            name="ForgeFlow Core",
            identifier="FORGE",
            description="Core monolithic engine, REST APIs, and client-side web application",
            status="in_progress",
            lead_id=alex.id,
            start_date=date.today() - timedelta(days=30),
            target_date=date.today() + timedelta(days=60),
            next_issue_number=11
        )
        proj_mobile = Project(
            workspace_id=workspace.id,
            name="Mobile Companion App",
            identifier="MBL",
            description="React Native companion client for triage, notifications, and on-the-go updates",
            status="planned",
            lead_id=sarah.id,
            start_date=date.today() + timedelta(days=15),
            target_date=date.today() + timedelta(days=90),
            next_issue_number=3
        )
        db.add_all([proj_core, proj_mobile])
        db.commit()

        # Cycle
        sprint1 = Cycle(
            project_id=proj_core.id,
            name="Sprint 14: Foundation & Kanban",
            description="Deliver core issue management, drag-and-drop Kanban, and AI task planner",
            start_date=date.today() - timedelta(days=7),
            end_date=date.today() + timedelta(days=7),
            status="active"
        )
        db.add(sprint1)
        db.commit()

        print("Seeding issues across Kanban columns...")
        issues_data = [
            # Backlog
            {
                "seq": "FORGE-1", "title": "Automate multi-region database failover testing",
                "desc": "Simulate primary node termination and measure replication lag to standby replicas.",
                "status": "backlog", "priority": "medium", "assignee": None, "labels": [lbl_db, lbl_be],
                "due": date.today() + timedelta(days=25), "order": 1000.0
            },
            {
                "seq": "FORGE-2", "title": "Benchmark WebSocket connection pooling limits",
                "desc": "Stress test concurrent active sockets under high broadcast volume.",
                "status": "backlog", "priority": "low", "assignee": None, "labels": [lbl_be],
                "due": date.today() + timedelta(days=30), "order": 2000.0
            },
            # Todo
            {
                "seq": "FORGE-3", "title": "Implement Redis rate-limiting on authentication endpoints",
                "desc": "Protect /api/v1/auth/login and /register against brute-force attacks with sliding-window limiter.",
                "status": "todo", "priority": "high", "assignee": sarah, "labels": [lbl_sec, lbl_be],
                "due": date.today() + timedelta(days=5), "order": 1000.0
            },
            {
                "seq": "FORGE-4", "title": "Add OAuth2 Google and GitHub single sign-on",
                "desc": "Provide one-click developer login supporting workspace invite auto-linking.",
                "status": "todo", "priority": "medium", "assignee": marcus, "labels": [lbl_sec],
                "due": date.today() + timedelta(days=12), "order": 2000.0
            },
            # In Progress
            {
                "seq": "FORGE-5", "title": "Build dark-first interactive Kanban board with drag-and-drop",
                "desc": "Seamless drag-and-drop between columns with optimistic UI updates, error rollback, and keyboard accessibility.",
                "status": "in_progress", "priority": "urgent", "assignee": alex, "labels": [lbl_fe, lbl_ux],
                "due": date.today() + timedelta(days=2), "order": 1000.0
            },
            {
                "seq": "FORGE-6", "title": "Integrate AI Task Planner with structured JSON validation",
                "desc": "Convert natural language product specifications into decomposed engineering tasks with preview and selective commit.",
                "status": "in_progress", "priority": "high", "assignee": alex, "labels": [lbl_ai, lbl_be],
                "due": date.today() + timedelta(days=3), "order": 2000.0
            },
            # In Review
            {
                "seq": "FORGE-7", "title": "Enforce strict tenant isolation checks on issue mutations",
                "desc": "Ensure users cannot access or alter resources from other workspaces even with manipulated IDs.",
                "status": "in_review", "priority": "urgent", "assignee": sarah, "labels": [lbl_sec, lbl_be],
                "due": date.today() + timedelta(days=1), "order": 1000.0
            },
            {
                "seq": "FORGE-8", "title": "Refactor activity audit logging into dedicated event worker",
                "desc": "Extract synchronous audit logging into non-blocking event dispatcher.",
                "status": "in_review", "priority": "medium", "assignee": marcus, "labels": [lbl_be],
                "due": date.today() + timedelta(days=4), "order": 2000.0
            },
            # Done
            {
                "seq": "FORGE-9", "title": "Setup normalized SQLAlchemy 2.0 models and Alembic migrations",
                "desc": "Define relational schema for Users, Workspaces, Projects, Issues, Comments, and ActivityEvents.",
                "status": "done", "priority": "high", "assignee": alex, "labels": [lbl_db, lbl_be],
                "due": date.today() - timedelta(days=2), "order": 1000.0
            },
            {
                "seq": "FORGE-10", "title": "Initialize Vite + React 19 frontend foundation",
                "desc": "Configure Tailwind CSS tokens, Lucide icons, dark-first color palette, and TanStack Query client.",
                "status": "done", "priority": "medium", "assignee": sarah, "labels": [lbl_fe],
                "due": date.today() - timedelta(days=3), "order": 2000.0
            }
        ]

        created_issues = []
        for d in issues_data:
            iss = Issue(
                workspace_id=workspace.id,
                project_id=proj_core.id,
                sequence_id=d["seq"],
                title=d["title"],
                description=d["desc"],
                status=d["status"],
                priority=d["priority"],
                assignee_id=d["assignee"].id if d["assignee"] else None,
                reporter_id=alex.id,
                cycle_id=sprint1.id,
                due_date=d["due"],
                order=d["order"]
            )
            iss.labels = d["labels"]
            db.add(iss)
            created_issues.append(iss)
        db.commit()

        # Seed comments
        print("Seeding comments and activity...")
        c1 = Comment(
            issue_id=created_issues[4].id,  # FORGE-5
            author_id=sarah.id,
            content="Testing drag-and-drop on mobile touch screens. Make sure touch-action: none is applied to the drag handles."
        )
        c2 = Comment(
            issue_id=created_issues[4].id,
            author_id=alex.id,
            content="Good catch! Implemented keyboard accessibility handlers with Space/Enter to pickup and arrow keys to move."
        )
        c3 = Comment(
            issue_id=created_issues[5].id,  # FORGE-6
            author_id=marcus.id,
            content="The deterministic fallback mode works beautifully even when no LLM API key is present in .env."
        )
        db.add_all([c1, c2, c3])
        db.commit()

        # Seed activity events
        a1 = ActivityEvent(
            workspace_id=workspace.id,
            issue_id=created_issues[4].id,
            actor_id=alex.id,
            verb="updated_status",
            field_name="status",
            old_value="todo",
            new_value="in_progress"
        )
        a2 = ActivityEvent(
            workspace_id=workspace.id,
            issue_id=created_issues[6].id,
            actor_id=sarah.id,
            verb="updated_status",
            field_name="status",
            old_value="in_progress",
            new_value="in_review"
        )
        a3 = ActivityEvent(
            workspace_id=workspace.id,
            issue_id=created_issues[8].id,
            actor_id=alex.id,
            verb="updated_status",
            field_name="status",
            old_value="in_review",
            new_value="done"
        )
        db.add_all([a1, a2, a3])
        db.commit()

        # Seed notifications
        n1 = Notification(
            recipient_id=alex.id,
            workspace_id=workspace.id,
            issue_id=created_issues[4].id,
            title="New comment on FORGE-5",
            message="Sarah Chen commented on 'Build dark-first interactive Kanban board with drag-and-drop'",
            is_read=False
        )
        n2 = Notification(
            recipient_id=alex.id,
            workspace_id=workspace.id,
            issue_id=created_issues[5].id,
            title="Assigned to FORGE-6",
            message="You were assigned to 'Integrate AI Task Planner with structured JSON validation'",
            is_read=False
        )
        db.add_all([n1, n2])
        db.commit()

        print("Demo data seeded successfully!")
        print("Demo credentials:")
        print("  Email:    alex@forgeflow.io")
        print("  Password: password123")
        print("  Workspace: forge-labs")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed()
