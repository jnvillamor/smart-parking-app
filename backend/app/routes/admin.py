from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models import User, Reservation, ParkingLot
from app.schema import DashboardSummary
from app.utils import get_admin_user, get_today_utc_range, get_month_utc_range

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
    start_today_utc, end_today_utc = get_today_utc_range()
    start_of_month, end_of_month = get_month_utc_range()

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
    # Fees are collected during reservation
    total_revenue = db.query(func.sum(Reservation.total_cost)).filter(
      Reservation.created_at >= start_of_month,
      Reservation.created_at < end_of_month,
      Reservation.is_cancelled == False
    ).scalar() or 0.0

    # Today's statistics
    new_users_today = db.query(User).filter(
      User.created_at >= start_today_utc,
      User.created_at < end_today_utc,
      User.is_active == True,
      User.role == "user"
    ).count()

    # New parking lots created today
    new_parking_lots_today = db.query(ParkingLot).filter(
      ParkingLot.created_at >= start_today_utc,
      ParkingLot.created_at < end_today_utc,
      ParkingLot.is_active == True
    ).count()

    # New reservations made today
    new_reservations_today = db.query(Reservation).filter(
      Reservation.created_at >= start_today_utc,
      Reservation.created_at < end_today_utc,
      Reservation.is_cancelled == False
    ).count()

    # Revenue generated today by completed reservations
    # Note: Assuming 'total_cost' is the field that holds the revenue amount
    new_revenue_today = db.query(func.sum(Reservation.total_cost)).filter(
      Reservation.created_at >= start_today_utc,
      Reservation.created_at < end_today_utc,
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