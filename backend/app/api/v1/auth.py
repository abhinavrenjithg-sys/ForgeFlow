from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import re

from backend.app.core.database import get_db
from backend.app.core.security import verify_password, get_password_hash, create_access_token
from backend.app.models.user import User
from backend.app.models.workspace import Workspace, WorkspaceMembership
from backend.app.schemas.user import UserCreate, UserLogin, TokenResponse, UserResponse
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text[:30]

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == user_in.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists"
        )
    
    # Create user
    user = User(
        email=user_in.email.lower().strip(),
        full_name=user_in.full_name.strip(),
        hashed_password=get_password_hash(user_in.password),
        avatar_url=user_in.avatar_url or f"https://api.dicebear.com/7.x/initials/svg?seed={user_in.full_name}"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Automatically provision a personal default workspace for quick onboarding
    base_slug = slugify(user.full_name.split()[0] + "-workspace") or "my-workspace"
    slug = base_slug
    counter = 1
    while db.query(Workspace).filter(Workspace.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    workspace = Workspace(
        name=f"{user.full_name.split()[0]}'s Workspace",
        slug=slug,
        description="Personal workspace for tracking your builds and sprints",
        owner_id=user.id
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)

    membership = WorkspaceMembership(
        workspace_id=workspace.id,
        user_id=user.id,
        role="admin"
    )
    db.add(membership)
    db.commit()

    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email.lower().strip()).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is deactivated"
        )

    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
