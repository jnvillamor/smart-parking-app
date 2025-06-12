from sqlalchemy.orm import Session
from datetime import datetime, timezone
from fastapi import HTTPException, status

from app.models import User, ParkingLot
from app.schema import ReservationCreate
from .parking import is_parking_full

def is_valid_request(now: datetime, reservation: ReservationCreate, parking_lot: ParkingLot, current_user: User) -> bool:
  """
  Validate the reservation request against the parking lot's current state.
  param now: Current datetime in UTC.
  param reservation: ReservationCreate object containing reservation details.
  param parking_lot: ParkingLot object to check against.
  """

  # Check if the user is not an admin
  if current_user.role == 'admin':
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail="Admins cannot create reservations."
    )

  # Check if the parking lot exists
  if not parking_lot:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Parking lot not found."
    )
  
  # Check if the parking lot is full
  if is_parking_full(now, parking_lot):
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Parking lot is full. Cannot create reservation."
    )

  # Check if the reservation time is in the past
  if reservation.start_time < now or reservation.end_time < now:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Reservation time cannot be in the past."
    )
  
  return True
  
