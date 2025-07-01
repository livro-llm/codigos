from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class MessageSchema(BaseModel):
    id: int
    chat_id: int
    sender: str
    content: str
    tokens_used: Optional[int] = None
    created_at: datetime
    deleted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
