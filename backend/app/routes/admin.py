from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone

from app.core.database import get_db
from app.models import User, Reservation, ParkingLot
from app.schema import DashboardSummary
from app.utils import get_admin_user

router = APIRouter(
  prefix="/admin",
  tags=["admin"],
)

@router.get("/summary", response_model=DashboardSummary, status_code=status.HTTP_200_OK)
def get_dashboard_summary(
  db: Session = Depends(get_db),
  current_user: User = Depends(get_admin_user)
):
  """
  Get the dashboard summary for the admin panel.
  This includes total users, active parking lots, today's reservations, and today's revenue.
  """
  try:
    total_users = db.query(User).filter(
      User.is_active == True,
      User.role == "user"
    ).count()

    total_active_parking = db.query(ParkingLot).filter(
      ParkingLot.is_active == True
    ).count()

    todays_reservations = db.query(Reservation).filter(
      Reservation.start_time >= datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0),
      Reservation.end_time <= datetime.now(timezone.utc).replace(hour=23, minute=59, second=59, microsecond=999999),
      Reservation.is_cancelled == False
    ).count()

    # Calculate today's revenue by summing the total_cost of today's reservations
    todays_revenue = db.query(func.sum(Reservation.total_cost)).filter(
      Reservation.start_time >= datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0),
      Reservation.end_time <= datetime.now(timezone.utc).replace(hour=23, minute=59, second=59, microsecond=999999),
      Reservation.is_cancelled == False
    ).scalar() or 0.0
  
    return DashboardSummary(
      total_users=total_users,
      total_active_parking=total_active_parking,
      todays_reservations=todays_reservations,
      todays_revenue=round(todays_revenue, 2)
    ).model_dump()
    
  except HTTPException as e:
    print(f"HTTPException: {e.detail}", flush=True)
    raise e
  except Exception as e:
    print(f"Unexpected error: {str(e)}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while fetching the dashboard summary."
    )