from pydantic import BaseModel, computed_field
from datetime import datetime, timezone

class ReservationBase(BaseModel):
  parking_id: int
  user_id: int
  start_time: datetime
  end_time: datetime

class ReservationCreate(ReservationBase):
  pass

class ReservationResponse(ReservationBase):
  id: int
  is_cancelled: bool
  created_at: datetime
  updated_at: datetime

  @computed_field
  def duration(self) -> int:
    """Calculate the duration of the reservation in minutes."""
    return int((self.end_time - self.start_time).total_seconds() / 60)

  @computed_field
  def status(self) -> str:
    """Determine the status of the reservation."""
    if self.is_cancelled:
      return "Cancelled"

    if self.start_time <= datetime.now(timezone.utc) <= self.end_time:
      return "Active"
    elif self.start_time > datetime.now(timezone.utc):
      return "Upcoming"
    else:
      return "Completed"
    
  model_config = {
    'from_attributes': True,
  }

class ReservationUser(BaseModel):
  id: int
  first_name: str
  last_name: str

  model_config = {
    'from_attributes': True,
  }