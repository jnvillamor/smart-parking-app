from pydantic import BaseModel

class DashboardSummary(BaseModel):
  total_users: int
  total_active_parking: int
  total_reservations: int
  total_revenue: float
  new_users_today: int
  new_parking_lots_today: int
  new_reservations_today: int
  new_revenue_today: float