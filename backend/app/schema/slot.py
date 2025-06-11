from pydantic import BaseModel

class SlotBase(BaseModel):
  name: int
  parking_lot_id: int
  is_reserved: bool = False

class SlotIDOnly(BaseModel):
  id: int

  model_config = {
    'from_attributes': True,
  }

class SlotDetail(SlotBase):
  id: int
  created_at: str
  updated_at: str

  model_config = {
    'from_attributes': True,
  }