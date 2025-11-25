from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from backend.src.schemas.base import BaseSchema


class WorkspaceResponse(BaseSchema):
    """Schema for workspace response"""

    id: int
    name: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime
    created_by: int


class WorkspaceCreate(BaseModel):
    """Schema for creating a new workspace"""

    name: str
    description: Optional[str] = None
    user_id: int = Field(alias="owner")