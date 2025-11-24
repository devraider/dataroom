from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class WorkspaceResponse(BaseModel):
    """Schema for workspace response"""
    model_config = {"from_attributes": True}

    id: int
    name: str
    description: Optional[str]
    created_at: datetime
    created_by: int

