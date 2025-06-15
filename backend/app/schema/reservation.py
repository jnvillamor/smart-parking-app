from pydantic import BaseModel, computed_field
from datetime import datetime, timezone
from .user import UserResponse
from typing import TYPE_CHECKING

if TYPE_CHECKING:
  from app.schema import ParkingResponseWithoutReservations


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
  duration_hours: float
  total_cost: float
  user: UserResponse
  parking: "ParkingResponseWithoutReservations"

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

class PaginatedReservations(BaseModel):
  reservations: list[ReservationResponse]
  total: int
  page: int
  limit: int
  total_pages: int

  @computed_field
  def has_next(self) -> bool:
    return (self.page * self.limit) < self.total
  
  @computed_field
  def has_previous(self) -> bool:
    return self.page > 1

  model_config = {
    'from_attributes': True,
  }

class ReservationSummary(BaseModel):
  total_reservations: int
  total_active_reservations: int
  total_upcoming_reservations: int
  total_completed_reservations: int