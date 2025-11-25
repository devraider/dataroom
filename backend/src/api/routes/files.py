from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from backend.src.api.auth.security import get_current_user
from backend.src.database.session import get_session
from backend.src.models.file import File
from backend.src.models.user import User
from backend.src.models.workspace import Workspace, WorkspaceMember

files_router = APIRouter()


@files_router.get("/")
def list_files():
    """List all files (placeholder)"""
    return {"message": "List of files"}