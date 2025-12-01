import datetime as dt

from sqlmodel import Field, SQLModel

from backend.src.types.date import utc_now


class TokenBlacklist(SQLModel, table=True):
    """Token blacklist model for invalidated JWT tokens"""

    __tablename__ = "token_blacklist"

    id: int | None = Field(default=None, primary_key=True)
    token: str = Field(unique=True, index=True, max_length=1024)
    user_id: int = Field(foreign_key="users.id", index=True)
    blacklisted_at: dt.datetime = Field(default_factory=utc_now)
    expires_at: dt.datetime = Field(index=True)
