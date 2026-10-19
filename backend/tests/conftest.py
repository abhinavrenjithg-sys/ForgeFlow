import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.core.database import Base, get_db
from backend.app.core.security import get_password_hash, create_access_token
from backend.app.main import app
from backend.app.models.user import User
from backend.app.models.workspace import Workspace, WorkspaceMembership
from backend.app.models.project import Project

# In-memory or isolated test database
TEST_DATABASE_URL = "sqlite:///./test_forgeflow.db"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)
    if os.path.exists("./test_forgeflow.db"):
        try:
            os.remove("./test_forgeflow.db")
        except Exception:
            pass

@pytest.fixture
def db():
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(db):
    user = User(
        email="testuser@forgeflow.io",
        full_name="Test Engineer",
        hashed_password=get_password_hash("password123"),
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture
def auth_headers(test_user):
    token = create_access_token(subject=test_user.id)
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def other_user(db):
    user = User(
        email="other@forgeflow.io",
        full_name="Other User",
        hashed_password=get_password_hash("password123"),
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture
def other_auth_headers(other_user):
    token = create_access_token(subject=other_user.id)
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def test_workspace(db, test_user):
    ws = Workspace(
        name="Primary Labs",
        slug="primary-labs",
        description="Workspace for primary tests",
        owner_id=test_user.id
    )
    db.add(ws)
    db.commit()
    db.refresh(ws)

    membership = WorkspaceMembership(
        workspace_id=ws.id,
        user_id=test_user.id,
        role="admin"
    )
    db.add(membership)
    db.commit()
    return ws

@pytest.fixture
def test_project(db, test_workspace, test_user):
    p = Project(
        workspace_id=test_workspace.id,
        name="Alpha Project",
        identifier="ALP",
        description="Alpha testing project",
        lead_id=test_user.id,
        next_issue_number=1
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return p
