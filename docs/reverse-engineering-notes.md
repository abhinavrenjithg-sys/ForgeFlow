# ForgeFlow — Reverse Engineering & Architectural Study Notes

## 1. Executive Summary & Reference Studied
* **Reference Application:** [Plane](https://github.com/makeplane/plane) (`makeplane/plane`)
* **Comparative References:** Linear, Atlassian Jira
* **Derived System:** **ForgeFlow** — AI-Powered Project Management Platform
* **Tagline:** *Plan smarter. Build faster. Ship together.*

This document details the architectural study, reverse-engineering methodology, workflow tracing, and technical trade-offs derived from analyzing the publicly observable architecture of Plane and contemporary modern project trackers (Linear, Jira).

---

## 2. Public Workflows & System Patterns Observed

### 2.1 Multi-Tenant Hierarchical Isolation Model
Plane implements a strict hierarchical domain boundary:
```
Workspace (Organization / Tenant Boundary)
 ├── Workspace Memberships (User <-> Role: Admin, Member, Viewer)
 ├── Projects (Scoped functional domains / Repositories of work)
 │    ├── Project Memberships (Scoped access & assignment)
 │    ├── Cycles (Timeboxed iterations / Sprints)
 │    ├── Labels (Categorical tags scoped to workspace/project)
 │    └── Issues / Work Items (Core unit of execution)
 │         ├── Human-Readable Identifier (e.g., FORGE-101)
 │         ├── Status Workflow (Backlog -> Todo -> In Progress -> In Review -> Done)
 │         ├── Priority (Urgent, High, Medium, Low, None)
 │         ├── Assignee & Reporter
 │         ├── Comments (Collaborative discussion stream)
 │         └── Activity Log (Audit history of all mutations)
 └── In-App Notifications (Assignment & mention dispatches)
```

**Key Observation:** Cross-tenant leakage is a catastrophic failure mode in multi-tenant SaaS. In Plane, queries are scoped to the active workspace slug/ID at the ORM layer. ForgeFlow replicates this with strict backend foreign key constraints and FastAPI dependency injection (`get_current_workspace_member`) that verifies workspace tenancy on every request before touching project or issue data.

### 2.2 Issue Lifecycle & Kanban State Transitions
In Plane and Linear, moving an issue on a Kanban board triggers:
1. **Optimistic Client Update:** The UI card immediately moves to the target column to guarantee 0ms perceived latency.
2. **Atomic REST/PATCH Request:** `PATCH /api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}` with `{ "status": "in_progress" }`.
3. **Database Transaction:**
   - Update issue status in PostgreSQL.
   - Insert an `ActivityEvent` record recording `actor_id`, `verb="updated_status"`, `old_value`, and `new_value`.
   - Dispatch `Notification` to assignee if the actor is distinct from the assignee.
4. **Error Rollback:** If the network fails or backend returns a 4xx/5xx, client-side state rolls back to the prior column with an actionable error toast.

### 2.3 Search, Filtering, and URL State Synchronization
Plane and Linear store active filter views (`status`, `priority`, `assignee`, `search`) in URL query parameters (`?status=in_progress&priority=urgent&q=auth`). This enables:
- Shareable links to exact filter states across team members.
- Seamless browser back/forward history navigation without state loss.
- Server-side filtering to avoid transferring full workspace databases into browser memory.

### 2.4 AI Integration: Beyond Gimmicks to Concrete Task Planning
Modern project managers frequently suffer from vague issue creation or high friction in turning a product brief into actionable work.
- **Reference Insight:** Plane introduced experimental AI features for issue description assistance and summarization.
- **ForgeFlow Original Innovation:** A dedicated **AI Task Planner**. The user provides a product brief, feature request, or technical specification. The AI orchestrates structured JSON generation decomposing the brief into:
  - Atomic tasks with recommended titles, descriptions, priorities, labels, subtasks, and acceptance criteria.
  - An **interactive editable preview** where users review, modify, select, or reject items.
  - Explicit confirmation before batch-committing issues to the database.
  - Zero arbitrary code execution; full role-based workspace validation; resilient fallback to a deterministic offline engine when external LLM API keys are unconfigured.

---

## 3. Comparative Architecture & Implementation Decisions

| Dimension | Reference (Plane) | ForgeFlow Implementation | Rationale |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | Django + Django REST Framework | **FastAPI + Pydantic v2 + SQLAlchemy 2.0** | Modern async-ready Python, automatic OpenAPI generation, type-safe validation, lower memory footprint. |
| **Frontend Framework** | React Router / Next.js + Tailwind | **React 19 + TypeScript + Vite + Tailwind CSS** | Blazing-fast HMR, lean bundle size, instant startup, clean component boundaries. |
| **State Management** | SWR / MobX | **TanStack Query (React Query) + Context** | Industry-standard server-state caching, automatic invalidation, optimistic UI mutations. |
| **Database & ORM** | PostgreSQL + Django ORM | **PostgreSQL (with SQLite dev fallback) + SQLAlchemy** | Normalized relational schema, Alembic migrations, unified async/sync engine abstraction. |
| **Background Processing** | Celery + Redis | **Modular in-process task scheduler & async worker hooks** | Monolithic simplicity without distributed operational overhead for small-to-medium deployments. |
| **UI Aesthetics** | Dark mode with brand accents | **Deep Charcoal/Near-Black (`#0B0F17`) + Lime Accent (`#84CC16`/`#A3E635`)** | Linear-grade visual polish, refined typography, crisp 1px borders (`border-white/10`), zero visual clutter. |

---

## 4. Challenges Encountered & Technical Trade-offs

1. **State Consistency during Drag-and-Drop:**
   - *Challenge:* Network latency can cause visual stutter if drag-and-drop waits for backend confirmation.
   - *Resolution:* Optimistic local state update in TanStack Query mutation with rollback on `onError`.
2. **Issue Key Generation Concurrency:**
   - *Challenge:* Simultaneous issue creation in the same project could produce duplicate human-readable IDs (`PROJ-10`).
   - *Resolution:* Atomic sequence calculation within a database transaction or project-level issue counter increment.
3. **Cross-Workspace Data Isolation:**
   - *Challenge:* Relying solely on issue ID in endpoints (e.g. `GET /issues/{id}`) can lead to ID-enumeration vulnerabilities (IDOR).
   - *Resolution:* Multi-level validation: all endpoints require workspace context, and repository queries explicitly filter `WHERE workspace_id = :workspace_id AND id = :id`.
4. **AI Output Hallucination & Schema Compliance:**
   - *Challenge:* LLMs can return unstructured text or malformed JSON that crashes frontend parsers.
   - *Resolution:* Strict Pydantic model validation on backend with structured JSON schema prompting and deterministic demonstration adapter for offline testing.

---

## 5. Lessons Learned
- **A modular monolith provides superior velocity and debuggability** compared to prematurely distributed microservices.
- **Auditability is fundamental to project management:** Storing every mutation in an immutable `ActivityEvent` table simplifies debugging, activity feeds, and user accountability.
- **Consistent dark-mode tokens** (charcoal backgrounds, muted text, vibrant lime accents) create an immediate sense of high craftsmanship that rivals leading commercial tools.
