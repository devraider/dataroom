from datetime import datetime
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel

from backend.src.models.user import User
from backend.src.types.date import utc_now
from backend.src.types.roles import RoleEnum


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


class WorkspaceMemberBase(SQLModel):
    """Base workspace member model"""
    role: RoleEnum = Field(default=RoleEnum.USER)


class WorkspaceMember(WorkspaceMemberBase, table=True):
    """Workspace member database model (junction table)"""
    __tablename__ = "workspace_members"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    workspace_id: int = Field(foreign_key="workspaces.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: User = Relationship(back_populates="workspaces")
    workspace: Workspace = Relationship(back_populates="members")
