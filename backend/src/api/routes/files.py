from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from backend.src.api.auth.security import get_current_user
from backend.src.database.session import get_session
from backend.src.models.file import File
from backend.src.models.user import User
from backend.src.models.workspace import Workspace, WorkspaceMember
from backend.src.schemas.file import FileResponse

files_router = APIRouter()


@files_router.get("/", response_model=list[FileResponse])
def get_workspace_files(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Get all files in a workspace"""
    workspace = session.get(Workspace, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    # Check if user is a member
    is_member = session.exec(
        select(WorkspaceMember).where(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == current_user.id
        )
    ).first()
    
    if not is_member:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get files for this workspace
    files = session.exec(
        select(File).where(File.workspace_id == workspace_id)
    ).all()
    
    return files

