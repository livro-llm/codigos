from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class ChatSchema(BaseModel):
    id: int
    user_id: int
    title: Optional[str] = None
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    deleted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
