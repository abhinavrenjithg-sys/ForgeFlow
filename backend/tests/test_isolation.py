from backend.app.models.workspace import Workspace, WorkspaceMembership
from backend.app.models.project import Project
from backend.app.models.issue import Issue

def test_cross_workspace_access_denied(client, other_auth_headers, test_workspace):
    # other_user attempts to list projects or issues in test_workspace
    response = client.get(
        f"/api/v1/workspaces/{test_workspace.slug}/projects",
        headers=other_auth_headers
    )
    assert response.status_code == 403
    assert "Access denied" in response.json()["detail"]

def test_cross_workspace_issue_mutation_blocked(client, other_auth_headers, test_workspace, test_project, db):
    # Create an issue in test_workspace
    issue = Issue(
        workspace_id=test_workspace.id,
        project_id=test_project.id,
        sequence_id="ALP-1",
        title="Confidential Internal Issue",
        status="todo",
        priority="high"
    )
    db.add(issue)
    db.commit()
    db.refresh(issue)

    # other_user attempts to fetch issue details
    get_res = client.get(
        f"/api/v1/workspaces/{test_workspace.slug}/issues/{issue.id}",
        headers=other_auth_headers
    )
    assert get_res.status_code == 403

    # other_user attempts to alter issue status
    patch_res = client.patch(
        f"/api/v1/workspaces/{test_workspace.slug}/issues/{issue.id}",
        headers=other_auth_headers,
        json={"status": "done"}
    )
    assert patch_res.status_code == 403

    # Verify status was NOT modified
    db.refresh(issue)
    assert issue.status == "todo"

def test_cross_workspace_idor_with_foreign_issue_id(client, auth_headers, test_workspace, other_user, db):
    # Setup a second isolated workspace for other_user
    ws2 = Workspace(
        name="Foreign Workspace",
        slug="foreign-ws",
        owner_id=other_user.id
    )
    db.add(ws2)
    db.commit()
    m2 = WorkspaceMembership(workspace_id=ws2.id, user_id=other_user.id, role="admin")
    p2 = Project(workspace_id=ws2.id, name="Secret", identifier="SEC")
    db.add_all([m2, p2])
    db.commit()

    foreign_issue = Issue(
        workspace_id=ws2.id,
        project_id=p2.id,
        sequence_id="SEC-1",
        title="Secret Blueprint",
        status="backlog"
    )
    db.add(foreign_issue)
    db.commit()

    # User in test_workspace passes foreign_issue.id to test_workspace endpoint
    res = client.get(
        f"/api/v1/workspaces/{test_workspace.slug}/issues/{foreign_issue.id}",
        headers=auth_headers
    )
    # Must return 404 Not Found in this workspace!
    assert res.status_code == 404
