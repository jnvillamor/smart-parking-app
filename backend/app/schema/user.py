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
  role: Literal["user", "admin"] = 'user' 

  @computed_field
  def full_name(self) -> str:
    return f"{self.first_name} {self.last_name}"
  
  model_config = {
    "from_attributes": True,
  }

class UserProfile(UserResponse):
  created_at: datetime
  updated_at: datetime

  model_config = {
    "from_attributes": True,
  }
