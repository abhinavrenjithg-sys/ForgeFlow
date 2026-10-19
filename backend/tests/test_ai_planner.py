def test_ai_planner_generate_plan(client, auth_headers, test_workspace, test_project):
    req_body = {
        "project_id": test_project.id,
        "prompt": "Build an audit log and real-time activity stream for security compliance"
    }
    response = client.post(
        f"/api/v1/workspaces/{test_workspace.slug}/ai/plan",
        headers=auth_headers,
        json=req_body
    )
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "suggested_tasks" in data
    assert len(data["suggested_tasks"]) >= 3
    
    first_task = data["suggested_tasks"][0]
    assert "title" in first_task
    assert "description" in first_task
    assert "priority" in first_task
    assert len(first_task["subtasks"]) > 0
    assert len(first_task["acceptance_criteria"]) > 0

def test_ai_planner_commit_tasks(client, auth_headers, test_workspace, test_project):
    commit_payload = {
        "project_id": test_project.id,
        "tasks": [
            {
                "title": "Configure audit event table indexes",
                "description": "Index workspace_id and created_at for fast timeline queries",
                "priority": "high",
                "status": "todo",
                "labels": ["Database", "Security"],
                "subtasks": ["Create composite btree index", "Run explain analyze"],
                "acceptance_criteria": ["Query execution time < 5ms"]
            },
            {
                "title": "Create WebSocket stream publisher",
                "description": "Broadcast audit events to connected workspace clients",
                "priority": "medium",
                "status": "todo",
                "labels": ["Backend"],
                "subtasks": ["Setup pubsub channel"],
                "acceptance_criteria": ["Event received within 50ms of commit"]
            }
        ]
    }

    commit_res = client.post(
        f"/api/v1/workspaces/{test_workspace.slug}/ai/plan/commit",
        headers=auth_headers,
        json=commit_payload
    )
    assert commit_res.status_code == 200
    res_data = commit_res.json()
    assert res_data["created_count"] == 2
    assert len(res_data["created_issue_ids"]) == 2

    # Verify issues actually exist in the project
    issues_res = client.get(
        f"/api/v1/workspaces/{test_workspace.slug}/issues?project_id={test_project.id}",
        headers=auth_headers
    )
    assert issues_res.status_code == 200
    titles = [i["title"] for i in issues_res.json()]
    assert "Configure audit event table indexes" in titles
    assert "Create WebSocket stream publisher" in titles
