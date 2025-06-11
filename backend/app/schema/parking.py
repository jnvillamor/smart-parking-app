from pydantic import BaseModel, Field, computed_field
from typing import List
from .slot import SlotIDOnly, SlotDetail
from datetime import datetime


class ParkingBase(BaseModel):
  name: str
  location: str
  total_slots: int = Field(..., ge=2, description="Total number of slots must be greater than 1")

class ParkingCreate(ParkingBase):
  pass

class ParkingResponseLite(ParkingBase):
  id: int
  created_at: datetime
  updated_at: datetime
  is_active: bool
  slots: List[SlotIDOnly] = []
  
  @computed_field
  def available_slots(self) -> int:
    return len([slot for slot in self.slots if not slot.is_reserved])

  model_config = {
    'from_attributes': True,
  }

class ParkingResponseDetail(ParkingResponseLite):
  slots: List[SlotDetail] = []

  model_config = {
    'from_attributes': True,
  }

class PaginatedParkingResponse(BaseModel):
  items: List
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