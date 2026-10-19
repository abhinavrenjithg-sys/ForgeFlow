def test_project_crud(client, auth_headers, test_workspace):
    # Create project
    create_res = client.post(
        f"/api/v1/workspaces/{test_workspace.slug}/projects",
        headers=auth_headers,
        json={
            "name": "Backend Refactor",
            "identifier": "REF",
            "description": "Refactoring monolithic modules",
            "status": "in_progress"
        }
    )
    assert create_res.status_code == 201
    proj_data = create_res.json()
    assert proj_data["name"] == "Backend Refactor"
    assert proj_data["identifier"] == "REF"

    # List projects
    list_res = client.get(
        f"/api/v1/workspaces/{test_workspace.slug}/projects",
        headers=auth_headers
    )
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

def test_issue_lifecycle_and_kanban_transition(client, auth_headers, test_workspace, test_project):
    # 1. Create issue
    create_res = client.post(
        f"/api/v1/workspaces/{test_workspace.slug}/issues",
        headers=auth_headers,
        json={
            "project_id": test_project.id,
            "title": "Build WebSocket channel",
            "description": "Realtime notification sync",
            "status": "todo",
            "priority": "high"
        }
    )
    assert create_res.status_code == 201
    issue = create_res.json()
    assert issue["sequence_id"] == "ALP-1"
    assert issue["status"] == "todo"
    assert issue["priority"] == "high"

    # 2. Kanban Drag-and-Drop simulation: Move issue from 'todo' to 'in_progress'
    patch_res = client.patch(
        f"/api/v1/workspaces/{test_workspace.slug}/issues/{issue['id']}",
        headers=auth_headers,
        json={"status": "in_progress", "order": 1500.0}
    )
    assert patch_res.status_code == 200
    updated_issue = patch_res.json()
    assert updated_issue["status"] == "in_progress"
    assert updated_issue["order"] == 1500.0

    # 3. Verify ActivityEvent was logged
    activity_res = client.get(
        f"/api/v1/workspaces/{test_workspace.slug}/activity/issue/{issue['id']}",
        headers=auth_headers
    )
    assert activity_res.status_code == 200
    events = activity_res.json()
    assert len(events) >= 1
    assert any(e["verb"] == "updated_status" and e["new_value"] == "in_progress" for e in events)

    # 4. Add comment
    comment_res = client.post(
        f"/api/v1/workspaces/{test_workspace.slug}/issues/{issue['id']}/comments",
        headers=auth_headers,
        json={"content": "PR is open and ready for code review."}
    )
    assert comment_res.status_code == 201
    assert comment_res.json()["content"] == "PR is open and ready for code review."

    # 5. Move to 'done'
    done_res = client.patch(
        f"/api/v1/workspaces/{test_workspace.slug}/issues/{issue['id']}",
        headers=auth_headers,
        json={"status": "done"}
    )
    assert done_res.status_code == 200
    assert done_res.json()["status"] == "done"

def test_issue_search_and_filtering(client, auth_headers, test_workspace, test_project):
    # Create two distinct issues
    client.post(
        f"/api/v1/workspaces/{test_workspace.slug}/issues",
        headers=auth_headers,
        json={
            "project_id": test_project.id,
            "title": "Quantum Encryption Protocol",
            "status": "todo",
            "priority": "urgent"
        }
    )
    client.post(
        f"/api/v1/workspaces/{test_workspace.slug}/issues",
        headers=auth_headers,
        json={
            "project_id": test_project.id,
            "title": "CSS Button hover animation",
            "status": "done",
            "priority": "low"
        }
    )

    # Filter by priority
    res_urgent = client.get(
        f"/api/v1/workspaces/{test_workspace.slug}/issues?priority=urgent",
        headers=auth_headers
    )
    assert res_urgent.status_code == 200
    assert all(i["priority"] == "urgent" for i in res_urgent.json())

    # Search by keyword
    res_search = client.get(
        f"/api/v1/workspaces/{test_workspace.slug}/issues?search=Quantum",
        headers=auth_headers
    )
    assert res_search.status_code == 200
    assert len(res_search.json()) >= 1
    assert "Quantum" in res_search.json()[0]["title"]
