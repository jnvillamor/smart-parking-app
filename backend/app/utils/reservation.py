from sqlalchemy.orm import Session
from datetime import datetime
from fastapi import HTTPException, status

from app.models import User, ParkingLot, Reservation
from app.schema import ReservationCreate
from .parking import is_parking_full

def is_valid_request(now: datetime, reservation: ReservationCreate, parking_lot: ParkingLot, current_user: User, db: Session) -> bool:
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
  
  # Check if there is no conflicting reservation
  if db.query(Reservation).filter(
    Reservation.user_id == reservation.user_id,
    Reservation.parking_id == reservation.parking_id,
    Reservation.start_time < reservation.end_time,
    Reservation.end_time > reservation.start_time
  ).first() is not None:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="You already have a reservation during this time."
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
  
