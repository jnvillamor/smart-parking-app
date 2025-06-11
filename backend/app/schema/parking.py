from pydantic import BaseModel, Field
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

  model_config = {
    'from_attributes': True,
  }

class ParkingResponseDetail(ParkingResponseLite):
  slots: List[SlotDetail] = []

  model_config = {
    'from_attributes': True,
  }