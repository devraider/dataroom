from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from backend.src.schemas.base import BaseSchema
from backend.src.types.roles import RoleEnum


class WorkspaceMemberResponse(BaseModel):
    """Schema for workspace member in response"""
    id: int
    email: str
    name: str
    picture: Optional[str]
    role: RoleEnum


class WorkspaceResponse(BaseSchema):
    """Schema for workspace response"""

    id: int
    name: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime
    created_by: int
    members: list[WorkspaceMemberResponse] = []


class WorkspaceCreate(BaseModel):
    """Schema for creating a new workspace"""

    name: str
    description: Optional[str] = None