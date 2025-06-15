from pydantic import BaseModel

class DashboardSummary(BaseModel):
  total_users: int
  total_active_parking: int
  todays_reservations: int
  todays_revenue: float
