import datetime as dt
from typing import Optional

from sqlmodel import Field, SQLModel

from backend.src.types.date import utc_now


class UserBase(SQLModel):
    """Base user model"""
    email: str = Field(unique=True, index=True, max_length=255)
    full_name: str = Field(max_length=255)


class User(UserBase, table=True):
    """User database model"""
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: dt.datetime = Field(default_factory=utc_now)
    updated_at: dt.datetime = Field(default_factory=utc_now)