# ForgeFlow — System Architecture & Implementation Plan

## 1. System Overview
**ForgeFlow** is a modern, high-performance project and issue management platform designed for engineering and product teams. It features a dark-first, precision UI, real-time-feeling Kanban interactions, multi-tenant workspace isolation, persistent relational storage, and an original AI Task Planner that converts natural language requirements into structured, reviewable issues.

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|                                                                                   |
|  React 19 + TypeScript + Vite + Tailwind CSS 4 + Lucide Icons                    |
|  - TanStack Query (Server State, Caching, Invalidation & Optimistic Updates)     |
|  - React Router v7 (Protected Routes, Slug-based Multi-Tenancy)                   |
|  - Accessible Kanban Board (Drag-and-Drop, Keyboard Navigation, Quick Create)    |
|  - Command Palette (Cmd+K Global Search, Quick Issue Creation)                   |
|  - Analytics & Metric Visualizations (Project Velocity, Status/Priority Ratios)  |
|  - AI Task Planner (Interactive Structured Decomposition & Editable Preview)     |
+----------------------------------------+------------------------------------------+
                                         | REST API (JSON / Bearer JWT)
                                         v
+-----------------------------------------------------------------------------------+
|                                  BACKEND API                                      |
|                                                                                   |
|  FastAPI Modular Monolith (Python 3.12+ / 3.14 compatible)                        |
|  - Core Security: Argon2/Bcrypt Password Hashing, JWT Session Management          |
|  - Middleware: CORS, Tenant Isolation Guards, Structured Error Handling          |
|  - API Endpoints (/api/v1):                                                       |
|      /auth          /workspaces      /projects       /issues                      |
|      /comments      /labels          /activity       /notifications               |
|      /analytics     /ai/plan         /health                                      |
|  - Business Services & Domain Logic:                                              |
|      TenantService  IssueService     AuditService    AIPlannerService             |
|  - Interchangeable AI Adapter: Real LLM (OpenAI/Anthropic/Gemini) + Offline Engine|
+----------------------------------------+------------------------------------------+
                                         | SQLAlchemy 2.0 ORM
                                         v
+-----------------------------------------------------------------------------------+
|                               PERSISTENCE & INFRA                                 |
|                                                                                   |
|  - PostgreSQL (Production / Docker Compose) / SQLite (Zero-config local test)     |
|  - Alembic Database Schema Migrations                                             |
|  - Immutable Audit Log Table (ActivityEvents for full traceability)               |
|  - Docker & Docker Compose Containerization                                       |
+-----------------------------------------------------------------------------------+
```

---

## 2. Component Breakdown

### 2.1 Backend Modules (`backend/app/`)
* **`core/`**: Configuration (`settings.py`), database session manager (`database.py`), cryptographic utilities (`security.py`), exceptions & middleware.
* **`models/`**: Declarative SQLAlchemy models:
  - `User`, `Workspace`, `WorkspaceMembership`, `Project`, `ProjectMembership`, `Issue`, `Label`, `IssueLabel`, `Comment`, `ActivityEvent`, `Notification`, `Cycle`.
* **`schemas/`**: Pydantic v2 schemas for request validation, serialization, and OpenAPI generation.
* **`api/v1/`**: FastAPI routers grouped by domain boundary:
  - `auth.py`: Register, login, current user profile.
  - `workspaces.py`: CRUD workspaces, member invites, role management.
  - `projects.py`: CRUD projects, project member assignments, cycles.
  - `issues.py`: Issue CRUD, Kanban status updates, priority sorting, filtering.
  - `comments.py`: Discussion threads on issues.
  - `labels.py`: Label management and assignment.
  - `activity.py`: Workspace and issue activity feeds.
  - `notifications.py`: Read/unread in-app notification management.
  - `analytics.py`: Aggregate calculations for workspace velocity and status distribution.
  - `ai.py`: Task planning endpoint with structured JSON generation and preview validation.
* **`services/`**: Encapsulated business logic (e.g. `ai_planner.py`, `activity_logger.py`).
* **`tests/`**: Pytest test suite covering auth, tenant isolation, issue CRUD, and AI adapter.

### 2.2 Frontend Architecture (`src/`)
* **`components/`**:
  - `layout/`: Top navigation, sidebar, workspace switcher, command palette.
  - `ui/`: Design system tokens (buttons, badges, inputs, dropdowns, modal dialogs, tabs).
  - `kanban/`: Column components, draggable issue cards, quick-add input.
  - `issues/`: Issue list view, detail drawer/modal, status/priority pickers, comments thread.
  - `analytics/`: Stat counters, workload breakdowns, distribution charts.
  - `ai/`: Interactive AI Task Planner modal with editable task review table.
* **`context/`**: AuthContext (token storage, active user, active workspace switching).
* **`hooks/`**: TanStack Query custom hooks for caching and mutations.
* **`services/`**: Typed API client with token interceptor and error formatting.
* **`types/`**: Comprehensive TypeScript interfaces mirroring backend schemas.

---

## 3. Security & Multi-Tenancy Architecture
1. **Tenant Isolation:** Every request to project or issue endpoints is verified against `WorkspaceMembership`. A user cannot view, modify, or delete resources in a workspace they are not a member of.
2. **Role-Based Access Control (RBAC):**
   - **Admin/Owner:** Full permissions to manage workspace settings, invite members, archive projects, and delete resources.
   - **Member:** Can create, edit, assign, and comment on projects and issues.
   - **Viewer:** Read-only access to projects and issues.
3. **Data Protection:** Passwords hashed with salt via Bcrypt/Argon2. JWT tokens signed with SHA256 and subject to expiration.
