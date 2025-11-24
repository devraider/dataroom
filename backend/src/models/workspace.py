from typing import Optional

from sqlmodel import Field, SQLModel


class WorkspaceBase(SQLModel):
    """Base workspace model"""
    name: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)

