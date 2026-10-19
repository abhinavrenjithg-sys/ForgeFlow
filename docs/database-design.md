# ForgeFlow — Database Design & Entity Relationship Specification

## 1. Relational Schema Diagram (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ WORKSPACE_MEMBERSHIPS : "belongs to"
    WORKSPACES ||--o{ WORKSPACE_MEMBERSHIPS : "contains"
    WORKSPACES ||--o{ PROJECTS : "owns"
    WORKSPACES ||--o{ LABELS : "defines"
    PROJECTS ||--o{ PROJECT_MEMBERSHIPS : "assigns"
    PROJECTS ||--o{ CYCLES : "schedules"
    PROJECTS ||--o{ ISSUES : "tracks"
    ISSUES ||--o{ ISSUE_LABELS : "tagged with"
    LABELS ||--o{ ISSUE_LABELS : "categorizes"
    ISSUES ||--o{ COMMENTS : "contains"
    ISSUES ||--o{ ACTIVITY_EVENTS : "audits"
    USERS ||--o{ COMMENTS : "authors"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ ISSUES : "assigned to"
    USERS ||--o{ ISSUES : "reported by"

    USERS {
        uuid id PK
        varchar email UK
        varchar full_name
        varchar hashed_password
        varchar avatar_url
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    WORKSPACES {
        uuid id PK
        varchar name
        varchar slug UK
        varchar description
        uuid owner_id FK
        timestamp created_at
        timestamp updated_at
    }

    WORKSPACE_MEMBERSHIPS {
        uuid id PK
        uuid workspace_id FK
        uuid user_id FK
        varchar role "admin | member | viewer"
        timestamp created_at
    }

    PROJECTS {
        uuid id PK
        uuid workspace_id FK
        varchar name
        varchar identifier "e.g. FORGE"
        varchar description
        varchar status "planned | in_progress | paused | completed | archived"
        uuid lead_id FK
        date start_date
        date target_date
        integer next_issue_number
        timestamp created_at
        timestamp updated_at
    }

    CYCLES {
        uuid id PK
        uuid project_id FK
        varchar name
        text description
        date start_date
        date end_date
        varchar status "upcoming | active | completed"
        timestamp created_at
    }

    ISSUES {
        uuid id PK
        uuid project_id FK
        uuid workspace_id FK
        varchar sequence_id UK "e.g. FORGE-101"
        varchar title
        text description
        varchar status "backlog | todo | in_progress | in_review | done | cancelled"
        varchar priority "urgent | high | medium | low | none"
        uuid assignee_id FK
        uuid reporter_id FK
        uuid cycle_id FK
        uuid parent_issue_id FK
        date due_date
        integer estimate_points
        timestamp created_at
        timestamp updated_at
    }

    LABELS {
        uuid id PK
        uuid workspace_id FK
        varchar name
        varchar color_hex
        timestamp created_at
    }

    ISSUE_LABELS {
        uuid issue_id FK
        uuid label_id FK
    }

    COMMENTS {
        uuid id PK
        uuid issue_id FK
        uuid author_id FK
        text content
        timestamp created_at
        timestamp updated_at
    }

    ACTIVITY_EVENTS {
        uuid id PK
        uuid workspace_id FK
        uuid issue_id FK
        uuid actor_id FK
        varchar verb "created | updated_status | updated_priority | assigned | commented"
        varchar field_name
        varchar old_value
        varchar new_value
        timestamp created_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid recipient_id FK
        uuid workspace_id FK
        uuid issue_id FK
        varchar title
        text message
        boolean is_read
        timestamp created_at
    }
```

---

## 2. Table Specifications & Indexes

### 2.1 Workspace Isolation Rules
1. All queries for project, issue, comment, and activity data MUST filter by `workspace_id`.
2. A foreign key index is placed on `workspace_id` for every tenant-scoped table (`projects`, `issues`, `labels`, `activity_events`, `notifications`).
3. Unique constraints:
   - `workspaces(slug)`: Enforces friendly URLs (`/workspaces/acme-corp/...`).
   - `workspace_memberships(workspace_id, user_id)`: Prevents duplicate membership records.
   - `issues(project_id, sequence_id)`: Guarantees unique human identifiers within a project.
   - `labels(workspace_id, name)`: Prevents duplicate label names within a workspace.

### 2.2 Key Indexes
- `idx_issues_workspace_status`: `(workspace_id, status)` for fast Kanban column grouping.
- `idx_issues_project_status`: `(project_id, status)` for project board rendering.
- `idx_issues_assignee`: `(assignee_id)` for "My Issues" instant filtering.
- `idx_activity_issue`: `(issue_id, created_at DESC)` for chronological audit logs.
- `idx_notifications_unread`: `(recipient_id, is_read)` for notification badge counts.
