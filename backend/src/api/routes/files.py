import os
import shutil

from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile
from sqlmodel import Session, select

from backend.src.api.auth.security import get_current_user
from backend.src.config.settings import app_settings
from backend.src.database.session import get_session
from backend.src.models.file import File
from backend.src.models.user import User
from backend.src.models.workspace import Workspace, WorkspaceMember
from backend.src.schemas.file import FileResponse
from backend.src.types.date import utc_now

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


@files_router.post("/import/google-drive", response_model=FileResponse)
async def import_from_google_drive(
        workspace_id: int,
        file: UploadFile = UploadFile(...),
        google_drive_id: None | str = Form(None),
        current_user: User = Depends(get_current_user),
        session: Session = Depends(get_session),
):
    """Import a file from Google Drive to a workspace"""
    workspace = session.get(Workspace, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    is_member = session.exec(
        select(WorkspaceMember).where(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == current_user.id
        )
    ).first()

    if not is_member:
        raise HTTPException(status_code=403, detail="Access denied")

    # Create workspace-specific directory
    workspace_dir = app_settings.STORAGE_BASE_PATH / str(workspace_id)
    workspace_dir.mkdir(parents=True, exist_ok=True)

    # Generate unique filename
    file_extension = os.path.splitext(file.filename or "")[1]
    timestamp = utc_now()
    unique_filename = f"{timestamp}_{file.filename}.{file_extension}"
    file_path = workspace_dir / unique_filename

    # Save the file
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save file: {str(e)}"
        )
    finally:
        file.file.close()

    file_size = file_path.stat().st_size


    db_file = File(
        name=file.filename or "unknown",
        file_path=str(file_path),
        file_size=file_size,
        mime_type=file.content_type,
        workspace_id=workspace_id,
        uploaded_by=current_user.id,
        google_drive_id=google_drive_id,
    )

    session.add(db_file)
    session.commit()
    session.refresh(db_file)

    return FileResponse.model_validate(db_file)
