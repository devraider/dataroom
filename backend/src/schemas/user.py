from pydantic import BaseModel


class UserResponse(BaseModel):

    """User response"""
    id: int
    email: str
    name: str
    picture: str | None