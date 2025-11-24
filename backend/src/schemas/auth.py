from pydantic import BaseModel


class GoogleLoginRequest(BaseModel):
    """Google login request"""
    credential: str


class TokenResponse(BaseModel):
    """Token response"""
    access_token: str
    token_type: str
    user: dict