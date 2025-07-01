from pydantic import BaseModel, ConfigDict
from datetime import date


class SubscriptionSchema(BaseModel):
    id: int
    user_id: int
    stripe_subscription_id: str
    plan_id: int
    status: str
    start_date: date
    end_date: date

    model_config = ConfigDict(from_attributes=True)
