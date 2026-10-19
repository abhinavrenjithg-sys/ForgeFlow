from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from backend.app.core.settings import settings
from backend.app.core.database import Base, engine
import backend.app.models  # Ensure all models are registered

# API Routers
from backend.app.api.v1 import (
    auth, workspaces, projects, issues, comments,
    labels, activity, notifications, analytics, ai
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create tables on startup (useful for SQLite & instant test drive)
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="ForgeFlow — AI-Powered Project Management Platform inspired by Plane, Linear, and Jira.",
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Checks
@app.get("/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "ForgeFlow API",
        "version": "1.0.0",
        "ai_provider": settings.AI_PROVIDER
    }

# Include API v1 Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(workspaces.router, prefix=settings.API_V1_STR)
app.include_router(projects.router, prefix=settings.API_V1_STR)
app.include_router(issues.router, prefix=settings.API_V1_STR)
app.include_router(comments.router, prefix=settings.API_V1_STR)
app.include_router(labels.router, prefix=settings.API_V1_STR)
app.include_router(activity.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
