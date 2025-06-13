from pydantic import BaseModel, Field, computed_field
from typing import List
from datetime import datetime
from .reservation import ReservationUser


class ParkingBase(BaseModel):
  name: str
  location: str
  total_slots: int = Field(..., ge=2, description="Total number of slots must be greater than 1")
  rate: float = Field(..., ge=1, description="Rate per hour")

class ParkingCreate(ParkingBase):
  pass

class ParkingResponseLite(ParkingBase):
  id: int
  created_at: datetime
  updated_at: datetime
  is_active: bool
  available_slots: int

  model_config = {
    'from_attributes': True,
  }

class ParkingResponseDetail(ParkingResponseLite):
  active_reservation: List[ReservationUser]

  model_config = {
    'from_attributes': True,
  }

class PaginatedParkingResponse(BaseModel):
  parking_lots: List
  total: int
  page: int
  limit: int

  @computed_field
  def has_next(self) -> bool:
    return (self.page * self.limit) < self.total
  
  @computed_field
  def has_previous(self) -> bool:
    return self.page > 1
  
  model_config = {
    'from_attributes': True,
  }