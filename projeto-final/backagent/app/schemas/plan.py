from pydantic import BaseModel, ConfigDict


class PlanSchema(BaseModel):
    id: int
    name: str
    price_cents: int
    max_chats: int
    max_tokens: int

    model_config = ConfigDict(from_attributes=True)
