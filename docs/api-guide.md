# ForgeFlow — REST API Specification (`/api/v1`)

## 1. Authentication & Security
ForgeFlow utilizes Bearer JWT tokens in the `Authorization` header:
```http
Authorization: Bearer <access_token>
```

Standard error envelope:
```json
{
  "detail": "Description of error",
  "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND"
}
```

---

## 2. API Endpoints

### 2.1 Authentication (`/auth`)
* `POST /api/v1/auth/register`: Create user account and return JWT access token.
  - Body: `{ "email": "dev@forgeflow.io", "password": "securepassword", "full_name": "Alex Mercer" }`
* `POST /api/v1/auth/login`: Authenticate and return JWT token.
  - Body: `{ "email": "dev@forgeflow.io", "password": "securepassword" }`
* `GET /api/v1/auth/me`: Retrieve current user profile and memberships.

### 2.2 Workspaces (`/workspaces`)
* `GET /api/v1/workspaces`: List workspaces the authenticated user belongs to.
* `POST /api/v1/workspaces`: Create a new workspace.
  - Body: `{ "name": "Hyperion Labs", "slug": "hyperion", "description": "Core engineering" }`
* `GET /api/v1/workspaces/{slug}`: Fetch workspace details and user role.
* `GET /api/v1/workspaces/{slug}/members`: List workspace members and roles.
* `POST /api/v1/workspaces/{slug}/members`: Add or invite a user to workspace.
  - Body: `{ "email": "teammate@forgeflow.io", "role": "member" }`

### 2.3 Projects (`/workspaces/{slug}/projects`)
* `GET /api/v1/workspaces/{slug}/projects`: List projects in workspace.
* `POST /api/v1/workspaces/{slug}/projects`: Create a new project.
  - Body: `{ "name": "Payment Gateway 2.0", "identifier": "PAY", "description": "Next-gen checkout engine", "status": "in_progress" }`
* `GET /api/v1/workspaces/{slug}/projects/{project_id}`: Get project details.
* `PATCH /api/v1/workspaces/{slug}/projects/{project_id}`: Update project metadata.
* `DELETE /api/v1/workspaces/{slug}/projects/{project_id}`: Archive or delete project.

### 2.4 Issues (`/workspaces/{slug}/issues`)
* `GET /api/v1/workspaces/{slug}/issues`: List/filter issues across projects or within a project.
  - Query params: `project_id`, `status`, `priority`, `assignee_id`, `label_id`, `search`, `page`, `limit`
* `POST /api/v1/workspaces/{slug}/issues`: Create a new issue.
  - Body: `{ "project_id": "uuid", "title": "Implement Stripe webhook idempotency", "description": "Prevent duplicate charges on network retry", "status": "todo", "priority": "high", "assignee_id": "uuid", "label_ids": ["uuid"], "due_date": "2026-11-01" }`
* `GET /api/v1/workspaces/{slug}/issues/{issue_id}`: Get full issue details including comments, labels, and activity audit log.
* `PATCH /api/v1/workspaces/{slug}/issues/{issue_id}`: Update issue status, priority, title, assignee, etc.
  - Note: Changing `status` generates an `ActivityEvent` audit record.
* `DELETE /api/v1/workspaces/{slug}/issues/{issue_id}`: Delete an issue.

### 2.5 Comments (`/workspaces/{slug}/issues/{issue_id}/comments`)
* `GET /api/v1/workspaces/{slug}/issues/{issue_id}/comments`: Get all discussion comments.
* `POST /api/v1/workspaces/{slug}/issues/{issue_id}/comments`: Post a new comment.
  - Body: `{ "content": "Root cause identified in webhook retry logic." }`

### 2.6 Labels (`/workspaces/{slug}/labels`)
* `GET /api/v1/workspaces/{slug}/labels`: List labels.
* `POST /api/v1/workspaces/{slug}/labels`: Create label with hex color.

### 2.7 Activity & Audit Feed (`/workspaces/{slug}/activity`)
* `GET /api/v1/workspaces/{slug}/activity`: Workspace-level audit feed.
* `GET /api/v1/workspaces/{slug}/issues/{issue_id}/activity`: Issue-specific timeline.

### 2.8 Notifications (`/workspaces/{slug}/notifications`)
* `GET /api/v1/workspaces/{slug}/notifications`: List in-app notifications.
* `PATCH /api/v1/workspaces/{slug}/notifications/{notification_id}/read`: Mark notification as read.

### 2.9 Analytics (`/workspaces/{slug}/analytics`)
* `GET /api/v1/workspaces/{slug}/analytics`: Computes total issues, open vs done counts, completion percentage, issues grouped by status and priority, and workload distribution by assignee.

### 2.10 AI Task Planner (`/workspaces/{slug}/ai/plan`)
* `POST /api/v1/workspaces/{slug}/ai/plan`:
  - Body: `{ "project_id": "uuid", "prompt": "Build a customer feedback collection widget with star rating and NPS sentiment analysis" }`
  - Response:
    ```json
    {
      "summary": "AI breakdown for Customer Feedback Widget",
      "suggested_tasks": [
        {
          "title": "Design interactive feedback modal component",
          "description": "Accessible dialog with star rating and NPS 1-10 selector",
          "priority": "high",
          "status": "todo",
          "labels": ["Frontend", "UX"],
          "acceptance_criteria": ["WCAG AA compliant keyboard navigation", "Mobile responsive viewport"],
          "subtasks": ["Create star rating SVG icons", "Add NPS slider", "Implement submit state animation"]
        }
      ]
    }
    ```
* `POST /api/v1/workspaces/{slug}/ai/plan/commit`:
  - Body: `{ "project_id": "uuid", "tasks": [ ...validated task objects... ] }`
  - Commits selected tasks directly into the project as real issues!
