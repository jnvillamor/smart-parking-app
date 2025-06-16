from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from datetime import datetime, timezone, timedelta
from typing import Literal

from app.core.database import get_db
from app.models import User, Reservation, Notification
from app.schema import UserBase, UserResponse, UpdatePassword, AdminUserSummary, PaginatedUsers, UserDashboardSummary, UserReservationSummary
from app.utils import get_current_user, verify_password, hash_password, get_admin_user, get_current_utc_time 

router = APIRouter(
  prefix="/users",
  tags=["users"],
)

@router.put("/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def update_user(
  user_id: int,
  user_data: UserBase,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
  """
  Update user information. \n
  Only the user themselves or an admin can update user information. \n
  param user_id: ID of the user to update.
  """
  try:
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found."
      )
    
    if user.id != current_user.id:
      raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to update this user."
      )

    # Update user details
    user.email = user_data.email
    user.first_name = user_data.first_name
    user.last_name = user_data.last_name

    # Commit the changes to the database
    db.commit()
    db.refresh(user)

    return UserResponse.model_validate(user).model_dump()
  except HTTPException as e:
    print(f"Error fetching user {user_id}: {e.detail}", flush=True)
    raise e
  except Exception as e:
    db.rollback()
    print(f"Error updating user {user_id}: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while updating the user."
    )

@router.put("/change-password/{user_id}", status_code=status.HTTP_200_OK)
async def change_password(
  user_id: int,
  data: UpdatePassword,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
  """
  Change the password of a user. \n
  Only the user themselves can change their password. \n
  param user_id: ID of the user whose password is to be changed.
  param data: Contains the old and new password.
  """
  try:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
      return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found."
      )
    
    if user.id != current_user.id:
      return HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to change this user's password."
      )
    
    # Verify the old password
    if not verify_password(data.old_password, user.password):
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Old password is incorrect."
      )
    
    # Update the password
    user.password = hash_password(data.new_password)
    db.commit()

    return {
      "message": "Password changed successfully."
    }
  
  except HTTPException as e:
    db.rollback()
    print(f"Error changing password for user {user_id}: {e.detail}", flush=True)
    raise e
  except Exception as e:
    db.rollback()
    print(f"Error changing password for user {user_id}: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while changing the password."
    )

@router.get("/summary", response_model=AdminUserSummary, status_code=status.HTTP_200_OK)
async def get_user_summary(
  db: Session = Depends(get_db),
  current_user: User = Depends(get_admin_user)
): 
  """
  Get a summary of users in the system. \n
  Only accessible by admin users.
  """
  try:
    total_user = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    inactive_users = db.query(User).filter(User.is_active == False).count()
    admin_users = db.query(User).filter(User.role == 'admin').count()

    return AdminUserSummary(
      total_users=total_user,
      active_users=active_users,
      inactive_users=inactive_users,
      admin_users=admin_users
    ).model_dump()

  except HTTPException as e:
    print(f"Error fetching user summary: {e.detail}", flush=True)
    raise e
  except Exception as e:
    print(f"Error fetching user summary: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while fetching the user summary."
    )

@router.get("/", response_model=PaginatedUsers, status_code=status.HTTP_200_OK)
async def get_users(
  page: int = 1,
  limit: int = 10,
  q: str = None,
  status: Literal["active", "inactive"] = None,
  role: Literal["user", "admin"] = None,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_admin_user)
):
  """
  Get a paginated list of users. \n
  Only accessible by admin users. \n
  """

  try: 
    query = db.query(User).filter(
      or_(
        User.first_name.ilike(f"%{q}%") if q else True,
        User.last_name.ilike(f"%{q}%") if q else True,
        User.email.ilike(f"%{q}%") if q else True
      ),
      User.is_active == (status == "active") if status else True,
      User.role == role if role else True,
    )
    total = query.count()
    total_pages = (total + limit - 1) // limit
    users = query.offset((page - 1) * limit).limit(limit).all()

    return PaginatedUsers(
      users=users,
      total=total,
      page=page,
      limit=limit,
      total_pages=total_pages
    ).model_dump()

  except HTTPException as e:
    print(f"Error fetching users: {e.detail}", flush=True)
    raise e
  
  except Exception as e:
    print(f"Error fetching users: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while fetching the users."
    )

@router.patch("/{user_id}/deactivate", status_code=status.HTTP_200_OK)
async def deactivate_user(
  user_id: int,
  message: str = "You have been deactivated.",
  db: Session = Depends(get_db),
  current_user: User = Depends(get_admin_user)
):
  """
  Deactivate a user. \n
  Only accessible by admin users. \n
  param user_id: ID of the user to deactivate.
  """
  try:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found."
      )
    
    user.is_active = False

    # Create a notification for the user
    notif = Notification(
      user_id = user.id,
      message = message,
    )

    db.add(notif)
    db.commit()
    db.refresh(user)

    return {
      "message": "User deactivated successfully."
    }
  
  except HTTPException as e:
    db.rollback()
    print(f"Error deactivating user {user_id}: {e.detail}", flush=True)
    raise e
  
  except Exception as e:
    db.rollback()
    print(f"Error deactivating user {user_id}: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while deactivating the user."
    )

@router.patch("/{user_id}/activate", status_code=status.HTTP_200_OK)
async def activate_user(
  user_id: int,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_admin_user)
):
  """
  Activate a user. \n
  Only accessible by admin users. \n
  param user_id: ID of the user to activate.
  """
  try:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found."
      )
    
    user.is_active = True

    # Create a notification for the user
    notif = Notification(
      user_id = user.id,
      message = f"Your account has been activated. You can now log in.",
    )

    db.add(notif)
    db.commit()
    db.refresh(user)

    return {
      "message": "User activated successfully."
    }
  
  except HTTPException as e:
    db.rollback()
    print(f"Error activating user {user_id}: {e.detail}", flush=True)
    raise e
  
  except Exception as e:
    db.rollback()
    print(f"Error activating user {user_id}: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while activating the user."
    )

@router.get("/{user_id}/dashboard", response_model=UserDashboardSummary, status_code=status.HTTP_200_OK)
async def get_user_dashboard_summary(
  user_id: int,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
  """
  Get the dashboard summary for a user. \n
  Only accessible by the user themselves or an admin user. \n
  param user_id: ID of the user whose dashboard summary is to be fetched.
  """
  try:
    now = datetime.now(timezone.utc)
    if current_user.id != user_id and current_user.role != 'admin':
      raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to view this user's dashboard."
      )

    reservation_query = db.query(Reservation)
    reservation_this_month = reservation_query.filter(
      Reservation.user_id == user_id,
      Reservation.is_cancelled == False,
      Reservation.start_time >= now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    )

    # Fetch active reservations for the user
    all_active_reservations = reservation_this_month.filter(
      Reservation.start_time <= now,
      Reservation.end_time >= now,
      Reservation.is_cancelled == False
    ).count()

    # Fetch all upcoming reservations for the user
    all_upcoming_reservations = reservation_this_month.filter(
      Reservation.start_time > now,
      Reservation.is_cancelled == False
    ).count()

    # Fetch all reservations for the current month
    all_reservation_current_month = reservation_this_month.count()

    # Fetch all the total spent by the user in the current month
    total_spent_current_month = reservation_this_month.with_entities(
      func.sum(Reservation.total_cost)
    ).scalar() or 0.0

    # Fetch the average duration of reservations for the user in the current month
    ave_duration_per_reservation = db.query(func.avg(Reservation.duration_hours)).filter(
      Reservation.user_id == user_id,
      Reservation.is_cancelled == False,
      Reservation.start_time >= now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    ).scalar() or 0.0

    # Fetch the recent reservations for the user
    recent_reservations = reservation_query.filter(
      Reservation.user_id == user_id,
      Reservation.is_cancelled == False
    ).order_by(Reservation.created_at.desc()).limit(5).all()
    
    return UserDashboardSummary(
      all_active_reservations=all_active_reservations,
      all_upcoming_reservations=all_upcoming_reservations,
      all_reservation_current_month=all_reservation_current_month,
      total_spent_current_month=total_spent_current_month,
      ave_duration_per_reservation=ave_duration_per_reservation,
      recent_reservations=recent_reservations
    ).model_dump()
  except HTTPException as e:
    print(f"Error fetching dashboard summary for user {user_id}: {e.detail}", flush=True)
    raise e
  
  except Exception as e:
    print(f"Error fetching dashboard summary for user {user_id}: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while fetching the user's dashboard summary."
    )

@router.get("/{user_id}/reservations", response_model=UserReservationSummary, status_code=status.HTTP_200_OK)
async def get_user_reservation_summary(
  user_id: int,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
  """
  Get the reservation summary for a user. \n
  Only accessible by the user themselves.
  """

  try:
    if current_user.id != user_id:
      raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to view this user's reservation summary."
      )
    
    now = get_current_utc_time()

    reservation_query = db.query(Reservation).filter(
      Reservation.user_id == user_id,
      Reservation.is_cancelled == False
    )

    # Fetch all reservations for the user
    all_reservation_count = reservation_query.count()

    # Fetch active reservations for the user
    active_reservations = reservation_query.filter(
      Reservation.start_time <= now,
      Reservation.end_time >= now
    )
    active_reservation_count = active_reservations.count()

    # Fetch upcoming reservations for the user
    upcoming_reservations = reservation_query.filter(
      Reservation.start_time > now
    )
    upcoming_reservation_count = upcoming_reservations.count()

    # Fetch the past reservations for the user
    past_reservations = db.query(Reservation).filter(
      Reservation.user_id == user_id,
      Reservation.created_at < now,
    )
    past_reservation_count = past_reservations.count()

    # Fetch the total spent by the user on reservations
    total_spent = reservation_query.with_entities(
      func.sum(Reservation.total_cost)
    ).scalar() or 0.0

    return UserReservationSummary(
      all_reservation_count=all_reservation_count,
      active_reservation_count=active_reservation_count,
      upcoming_reservation_count=upcoming_reservation_count,
      active_reservations=active_reservations.all(),
      upcoming_reservations=upcoming_reservations.all(),
      past_reservation_count=past_reservation_count,
      past_reservations=past_reservations.all(),
      total_spent=total_spent
    ).model_dump()

  except HTTPException as e:
    print(f"Error fetching reservation summary for user {user_id}: {e.detail}", flush=True)
    raise e
  except Exception as e:
    print(f"Error fetching reservation summary for user {user_id}: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while fetching the user's reservation summary."
    )