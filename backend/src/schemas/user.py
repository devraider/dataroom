from pydantic import BaseModel

from backend.src.types.roles import RoleEnum


class UserResponse(BaseModel):
    """User response"""

    id: int
    email: str
    name: str
    role: RoleEnum
    picture: str | None
