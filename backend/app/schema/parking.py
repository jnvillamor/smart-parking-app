from pydantic import BaseModel, Field, computed_field
from typing import List
from datetime import datetime
from .reservation import ReservationResponse


class ParkingBase(BaseModel):
  name: str
  location: str
  total_slots: int = Field(..., ge=2, description="Total number of slots must be greater than 1")
  rate: float = Field(..., ge=1, description="Rate per hour")

class ParkingCreate(ParkingBase):
  pass

class ParkingResponse(ParkingBase):
  id: int
  created_at: datetime
  updated_at: datetime
  is_active: bool
  reservations: List[ReservationResponse]

  @computed_field
  def available_slots(self) -> int:
    if self.reservations:
      return self.total_slots - len([r for r in self.reservations if r.status == 'Active' or 'Upcoming'])
    return self.total_slots

  model_config = {
    'from_attributes': True,
  }

class PaginatedParkingResponse(BaseModel):
  parking_lots: List[ParkingResponse]
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

class ParkingSummaryResponse(BaseModel):
  total_parking_lots: int
  total_active_parking_lots: int
  total_available_slots: int
  total_reserved_slots: int

  model_config = {
    'from_attributes': True,
  }