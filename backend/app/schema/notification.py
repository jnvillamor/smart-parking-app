from pydantic import BaseModel
from datetime import datetime
from .user import UserResponse 

class NotificationBase(BaseModel):
  id: int
  user_id: int
  message: str
  created_at: datetime
  is_read: bool
  user: UserResponse

  model_config = {
    "from_attributes": True,
  }