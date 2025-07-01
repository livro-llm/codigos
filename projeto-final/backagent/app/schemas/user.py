from pydantic import BaseModel, ConfigDict


class UserSchema(BaseModel):
    id: int
    email: str
    name: str
    stripe_customer_id: str | None = None
    current_plan_id: int | None = None

    model_config = ConfigDict(from_attributes=True)
