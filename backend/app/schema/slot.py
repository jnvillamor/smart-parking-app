from pydantic import BaseModel
from datetime import datetime

class SlotBase(BaseModel):
  name: str
  parking_lot_id: int
  is_reserved: bool = False

class SlotIDOnly(BaseModel):
  id: int

  model_config = {
    'from_attributes': True,
  }

class SlotDetail(SlotBase):
  id: int
  created_at: datetime
  updated_at: datetime

  model_config = {
    'from_attributes': True,
  }