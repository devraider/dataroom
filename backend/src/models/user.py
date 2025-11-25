import datetime as dt
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from backend.src.types.date import utc_now

if TYPE_CHECKING:
    from backend.src.models.workspace import WorkspaceMember


class UserBase(SQLModel):
    """Base user model"""
    email: str = Field(unique=True, index=True, max_length=255)
    full_name: str = Field(max_length=255)


class User(UserBase, table=True):
    """User database model"""
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    google_user_id: str = Field(unique=True, index=True, max_length=255)
    created_at: dt.datetime = Field(default_factory=utc_now)
    updated_at: dt.datetime = Field(default_factory=utc_now)
    
    # Relationships
    workspaces: list["WorkspaceMember"] = Relationship(back_populates="user")