from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel

from backend.src.types.date import utc_now


class WorkspaceBase(SQLModel):
    """Base workspace model"""
    name: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)


class Workspace(WorkspaceBase, table=True):
    """Workspace database model"""
    __tablename__ = "workspaces"

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)
    created_by: int = Field(foreign_key="users.id")
