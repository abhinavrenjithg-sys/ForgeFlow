import urllib.request
import json

def verify_live_api():
    print("=================================================")
    print("       FORGEFLOW END-TO-END API TEST SUITE       ")
    print("=================================================")

    # 1. Login
    login_data = json.dumps({'email': 'alex@forgeflow.io', 'password': 'password123'}).encode()
    req = urllib.request.Request('http://127.0.0.1:8000/api/v1/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        login_res = json.loads(resp.read().decode())
    token = login_res['access_token']
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    print(f"1. [AUTH] Login successful! User: {login_res['user']['full_name']} ({login_res['user']['email']})")

    # 2. Get Workspaces
    req = urllib.request.Request('http://127.0.0.1:8000/api/v1/workspaces/', headers=headers)
    with urllib.request.urlopen(req) as resp:
        workspaces = json.loads(resp.read().decode())
    ws_id = workspaces[0]['id']
    ws_slug = workspaces[0]['slug']
    print(f"2. [WORKSPACES] Found {len(workspaces)} workspace(s): {[w['name'] for w in workspaces]} (active slug: {ws_slug})")

    # 3. Get Projects
    req = urllib.request.Request(f'http://127.0.0.1:8000/api/v1/workspaces/{ws_slug}/projects', headers=headers)
    with urllib.request.urlopen(req) as resp:
        projects = json.loads(resp.read().decode())
    proj_id = projects[0]['id']
    print(f"3. [PROJECTS] Found {len(projects)} project(s): {[p['name'] for p in projects]}")

    # 4. Get Issues
    req = urllib.request.Request(f'http://127.0.0.1:8000/api/v1/workspaces/{ws_slug}/issues?project_id={proj_id}', headers=headers)
    with urllib.request.urlopen(req) as resp:
        issues = json.loads(resp.read().decode())
    print(f"4. [ISSUES] Retrieved {len(issues)} issue(s) for project '{projects[0]['name']}':")
    for i in issues[:4]:
        print(f"   - [{i['sequence_id']}] ({i['status'].upper()}) {i['title']} [Priority: {i['priority']}]")

    # 5. Move an issue on Kanban (Backlog -> In Progress)
    target_issue = issues[0]
    update_data = json.dumps({'status': 'in_progress'}).encode()
    req = urllib.request.Request(f'http://127.0.0.1:8000/api/v1/workspaces/{ws_slug}/issues/{target_issue["id"]}', data=update_data, headers=headers, method='PATCH')
    with urllib.request.urlopen(req) as resp:
        updated_issue = json.loads(resp.read().decode())
    print(f"5. [KANBAN MOVE] Issue {updated_issue['sequence_id']} transitioned status: {target_issue['status']} -> {updated_issue['status']}")

    # 6. Live AI Task Planner
    ai_req_data = json.dumps({
        'project_id': proj_id,
        'prompt': 'Implement Redis rate limiting and security headers for API gateway'
    }).encode()
    req = urllib.request.Request(f'http://127.0.0.1:8000/api/v1/workspaces/{ws_slug}/ai/plan', data=ai_req_data, headers=headers)
    with urllib.request.urlopen(req) as resp:
        ai_plan = json.loads(resp.read().decode())
    print(f"6. [AI TASK PLANNER] Generated {len(ai_plan['suggested_tasks'])} structured tasks! (Mode: {ai_plan['execution_mode']}, Provider: {ai_plan['provider']})")
    print(f"   - Architecture Summary: {ai_plan['summary']}")
    for task in ai_plan['suggested_tasks'][:2]:
        print(f"   -> AI Suggestion: {task['title']} [{task['priority']}]")

    # 6b. Live AI Commit
    commit_payload = json.dumps({
        'project_id': proj_id,
        'tasks': [ai_plan['suggested_tasks'][0]]
    }).encode()
    req = urllib.request.Request(f'http://127.0.0.1:8000/api/v1/workspaces/{ws_slug}/ai/plan/commit', data=commit_payload, headers=headers)
    with urllib.request.urlopen(req) as resp:
        commit_res = json.loads(resp.read().decode())
    print(f"6b. [AI BATCH COMMIT] Successfully committed {commit_res['created_count']} task(s) directly to project! Issue IDs: {commit_res['created_issue_ids']}")

    # 7. Live Analytics
    req = urllib.request.Request(f'http://127.0.0.1:8000/api/v1/workspaces/{ws_slug}/analytics', headers=headers)
    with urllib.request.urlopen(req) as resp:
        analytics = json.loads(resp.read().decode())
    print(f"7. [ANALYTICS] Live metrics computed from DB:")
    print(f"   - Total Issues: {analytics['total_issues']}")
    print(f"   - Open Issues: {analytics['open_issues']}")
    print(f"   - Completed Issues: {analytics['completed_issues']}")
    print(f"   - Completion Rate: {analytics['completion_rate']}%")
    print(f"   - Status Breakdown: {analytics['issues_by_status']}")

    print("\n>>> ALL 7 FORGEFLOW END-TO-END VERIFICATION CHECKS PASSED PERFECTLY! <<<")

if __name__ == '__main__':
    verify_live_api()
