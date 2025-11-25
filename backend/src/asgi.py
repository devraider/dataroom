from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.src.api.routes.workspace import workspace_router
from backend.src.config.settings import app_settings
from backend.src.database.session import create_db_and_tables

# Import models so SQLModel knows about them
from backend.src.models import file, user, workspace  # noqa: F401


@asynccontextmanager
async def lifespan_event(app: FastAPI):
    print("Starting up...")
    # Create tables only if they don't exist (dev mode)
    #TODO: Later, use alembic migrations for production
    create_db_and_tables()
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


app.include_router(workspace_router)