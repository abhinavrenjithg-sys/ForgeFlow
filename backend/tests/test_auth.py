def test_register_success(client):
    payload = {
        "email": "newdev@forgeflow.io",
        "full_name": "New Developer",
        "password": "strongpassword123"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "newdev@forgeflow.io"
    assert data["user"]["full_name"] == "New Developer"

def test_register_duplicate_email(client, test_user):
    payload = {
        "email": test_user.email,
        "full_name": "Duplicate User",
        "password": "password123"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_login_success(client, test_user):
    payload = {
        "email": test_user.email,
        "password": "password123"
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == test_user.email

def test_login_invalid_password(client, test_user):
    payload = {
        "email": test_user.email,
        "password": "wrongpassword"
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]

def test_get_me_profile(client, test_user, auth_headers):
    response = client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_user.id
    assert data["email"] == test_user.email

def test_get_me_unauthorized(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
