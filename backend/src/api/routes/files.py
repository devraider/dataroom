from fastapi import APIRouter

files_router = APIRouter(prefix="/files", tags=["files"])


@files_router.get("/")
def list_files():
    """List all files (placeholder)"""
    return {"message": "List of files"}