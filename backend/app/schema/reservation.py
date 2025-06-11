from pydantic import BaseModel, computed_field
from datetime import datetime, timezone

class ReservationBase(BaseModel):
  parking_id: int
  user_id: int
  start_time: str
  end_time: str

class ReservationCreate(ReservationBase):
  pass

class ReservationResponse(ReservationBase):
  id: int
  is_cancelled: bool
  created_at: datetime
  updated_at: datetime
  duration: int

  @computed_field
  def status(self) -> str:
    if self.is_cancelled:
      return "Cancelled"

    if self.start_time <= datetime.now(timezone.utc) <= self.end_time:
      return "Active"
    elif self.start_time > datetime.now(timezone.utc):
      return "Upcoming"
    else:
      return "Completed"

class ReservationUser(BaseModel):
  id: int
  first_name: str
  last_name: str

  model_config = {
    'from_attributes': True,
  }