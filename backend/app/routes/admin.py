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
    # Get current time
    now = datetime.now(timezone.utc)
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = now.replace(hour=23, minute=59, second=59, microsecond=999999)

    # Start and end of the month
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    # Next month (to calculate end of current month)
    if now.month == 12:
        next_month = now.replace(year=now.year + 1, month=1, day=1)
    else:
        next_month = now.replace(month=now.month + 1, day=1)
    end_of_month = next_month.replace(hour=0, minute=0, second=0, microsecond=0)

    # Total users who are active and have the role 'user'
    total_users = db.query(User).filter(
      User.is_active == True,
      User.role == "user"
    ).count()

    # Total active parking lots
    total_active_parking = db.query(ParkingLot).filter(
      ParkingLot.is_active == True
    ).count()

    # Total reservations for this month
    total_reservations = db.query(Reservation).filter(
      Reservation.start_time >= start_of_month,
      Reservation.end_time < end_of_month,
      Reservation.is_cancelled == False
    ).count()

    # Total revenue for this month
    # Assuming that payments are collected when the reservation starts
    total_revenue = db.query(func.sum(Reservation.total_cost)).filter(
      Reservation.start_time <= now,
      Reservation.start_time >= start_of_month,
      Reservation.end_time < end_of_month,
      Reservation.is_cancelled == False
    ).scalar() or 0.0

    # Today's statistics
    new_users_today = db.query(User).filter(
      User.created_at >= start_of_day,
      User.is_active == True,
      User.role == "user"
    ).count()

    # New parking lots created today
    new_parking_lots_today = db.query(ParkingLot).filter(
      ParkingLot.created_at >= start_of_day,
      ParkingLot.is_active == True
    ).count()

    # New reservations made today
    new_reservations_today = db.query(Reservation).filter(
      Reservation.created_at >= start_of_day,
      Reservation.is_cancelled == False
    ).count()

    # Revenue generated today by completed reservations
    # Note: Assuming 'total_cost' is the field that holds the revenue amount
    new_revenue_today = db.query(func.sum(Reservation.total_cost)).filter(
      Reservation.start_time <= now,
      Reservation.start_time >= start_of_day,
      Reservation.is_cancelled == False
    ).scalar() or 0.0

    return DashboardSummary(
      total_users=total_users,
      total_active_parking=total_active_parking,
      total_reservations=total_reservations,
      total_revenue=total_revenue,
      new_users_today=new_users_today,
      new_parking_lots_today=new_parking_lots_today,
      new_reservations_today=new_reservations_today,
      new_revenue_today=new_revenue_today
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