from datetime import datetime
from typing import Optional

from pydantic import Field

from backend.src.schemas.base import BaseSchema


class FileResponse(BaseSchema):
    """File response schema with camelCase field names"""
    
    id: int
    name: str
    file_path: str
    size: int = Field(alias="fileSize")
    mime_type: Optional[str] = Field(default=None, alias="mimeType")
    google_drive_id: Optional[str] = Field(default=None, alias="googleDriveId")
    thumbnail_url: Optional[str] = Field(default=None, alias="thumbnailUrl")
    web_view_link: Optional[str] = Field(default=None, alias="webViewLink")
    workspace_id: int = Field(alias="workspaceId")
    uploaded_by: int = Field(alias="uploadedBy")
    created_at: datetime = Field(alias="createdAt")
    modified_at: datetime = Field(alias="modifiedAt")
