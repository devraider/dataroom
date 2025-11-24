from typing import Any

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from backend.src.database.session import get_session
from backend.src.models.workspace import Workspace

workspace_router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@workspace_router.get("/", response_model=list[Any])
def get_workspaces(
    session: Session = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
):
    """Get all workspaces"""
    statement = select(Workspace).offset(skip).limit(limit)
    workspaces = session.exec(statement).all()

    return workspaces
