from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, delete

from backend.src.api.routes.auth import auth_router
from backend.src.api.routes.workspace import workspace_router
from backend.src.config.settings import app_settings
from backend.src.database.session import create_db_and_tables, engine
from backend.src.models.token_blacklist import TokenBlacklist
from backend.src.types.date import utc_now


def cleanup_expired_tokens():
    """Remove expired tokens from blacklist"""
    with Session(engine) as session:
        statement = delete(TokenBlacklist).where(TokenBlacklist.expires_at < utc_now())
        session.exec(statement)
        session.commit()


@asynccontextmanager
async def lifespan_event(app: FastAPI):
    print("Starting up...")
    # Create tables only if they don't exist (dev mode)
    # TODO: Later, use alembic migrations for production
    create_db_and_tables()
    # Clean up expired tokens on startup
    cleanup_expired_tokens()
    yield
    print("Shutting down...")


app = FastAPI(title="Data Room", version="1.0.0", lifespan=lifespan_event)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=app_settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(workspace_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
