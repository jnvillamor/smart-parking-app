from pydantic import BaseModel, EmailStr, computed_field
from typing import Literal, List, TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
  from app.schema.reservation import ReservationResponse
class UserBase(BaseModel):
  email: EmailStr
  first_name: str
  last_name: str

  model_config = {
    "from_attributes": True,
  }

class UserCreate(UserBase):
  password: str

class UpdatePassword(BaseModel):
  old_password: str
  new_password: str

  model_config = {
    "from_attributes": True,
  }

class UserResponse(UserBase):
  id: int
  is_active: bool
  last_login: datetime
  last_seen: datetime
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

class AdminUserSummary(BaseModel):
  total_users: int
  active_users: int
  inactive_users: int
  admin_users: int

class PaginatedUsers(BaseModel):
  users: List[UserProfile]
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

class UserDashboardSummary(BaseModel):
  all_active_reservations: int
  all_upcoming_reservations: int
  all_reservation_current_month: int
  total_spent_current_month: float
  ave_duration_per_reservation: float
  recent_reservations: List["ReservationResponse"]

class UserReservationSummary(BaseModel):
  all_reservation_count: int
  active_reservation_count: int
  upcoming_reservation_count: int
  total_spent: float
  upcoming_reservations: List["ReservationResponse"]
  active_reservations: List["ReservationResponse"]