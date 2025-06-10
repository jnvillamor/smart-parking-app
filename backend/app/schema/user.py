from pydantic import BaseModel, EmailStr, computed_field
from typing import Literal
from datetime import datetime

class UserBase(BaseModel):
  email: EmailStr
  first_name: str
  last_name: str

  model_config = {
    "from_attributes": True,
  }

class UserCreate(UserBase):
  password: str

class UserResponse(UserBase):
  id: int
  created_at: datetime
  updated_at: datetime
  role: str = Literal["user", "admin"]

  @computed_field
  def full_name(self) -> str:
    return f"{self.first_name} {self.last_name}"

  class Config:
    orm_mode = True