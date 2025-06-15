from pydantic import BaseModel
from datetime import datetime
from .user import UserResponse 
from typing import List

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

class NotificationResponse(BaseModel):
  read_notifications: List[NotificationBase]
  unread_notifications: List[NotificationBase]
  all_notifications_count: int
  read_notifications_count: int
  unread_notifications_count: int