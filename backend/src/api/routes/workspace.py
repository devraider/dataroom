
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from backend.src.api.auth.security import get_current_user
from backend.src.database.session import get_session
from backend.src.models.user import User
from backend.src.models.workspace import Workspace, WorkspaceMember
from backend.src.schemas.workspace import WorkspaceResponse

workspace_router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@workspace_router.get("/", response_model=list[WorkspaceResponse])
def get_workspaces(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
):
    """Get workspaces for the current authenticated user"""
    # Get workspaces where user is a member
    statement = (
        select(Workspace)
        .join(WorkspaceMember)
        .where(WorkspaceMember.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
    )
    workspaces = session.exec(statement).all()

    return workspaces
