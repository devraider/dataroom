import pydantic
from pydantic import BaseModel

from backend.src.schemas.user import UserResponse


class GoogleLoginRequest(BaseModel):
    """Google login request"""
    credential: str


class GoogleLoginResponse(BaseModel):
    """Google login response"""
    class Config:
        extra = "ignore"
        populate_by_name = True

    email: str
    user_id: str = pydantic.Field(alias="sub")
    audience: str = pydantic.Field(alias="aud")
    email_verified: bool
    name: str
    picture: str | None

class TokenResponse(BaseModel):
    """Token response"""
    token: str
    user: UserResponse