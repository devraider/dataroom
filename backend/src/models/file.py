from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from backend.src.types.date import utc_now

if TYPE_CHECKING:
    from backend.src.models.workspace import Workspace


class FileBase(SQLModel):
    """Base file model"""
    name: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    file_path: str = Field(max_length=500)
    file_size: int = Field(default=0)
    mime_type: Optional[str] = Field(default=None, max_length=100)
    google_drive_id: Optional[str] = Field(default=None, max_length=255)
    thumbnail_url: Optional[str] = Field(default=None, max_length=500)
    web_view_link: Optional[str] = Field(default=None, max_length=500)


class File(FileBase, table=True):
    """File database model"""
    __tablename__ = "files"

    id: Optional[int] = Field(default=None, primary_key=True)
    workspace_id: int = Field(foreign_key="workspaces.id")
    uploaded_by: int = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)

    # Relationships
    workspace: "Workspace" = Relationship(back_populates="files")
