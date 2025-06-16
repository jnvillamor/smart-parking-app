from sqlalchemy.orm import Session, Query
from sqlalchemy import or_, and_, case
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
  
  # Check if the parking lot is active
  if not parking_lot.is_active:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Cannot create reservation for an inactive parking lot."
    )
  
  # Check if the reservation overlaps with an existing reservation for the user
  # This checks if the user already has a reservation on the same parking that overlaps with the new one
  existing_reservation = db.query(Reservation).filter(
    Reservation.is_cancelled == False,
    Reservation.user_id == current_user.id,
    Reservation.parking_id == reservation.parking_id,
    or_(
      and_(
        Reservation.start_time < reservation.end_time,
        Reservation.end_time > reservation.start_time
      ),
      and_(
        Reservation.start_time < reservation.start_time,
        Reservation.end_time > reservation.start_time
      )
    )
  ).first()

  if existing_reservation:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="You already have a reservation that overlaps with this one."
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
  
def sort_reservations(query: Query, sort_by: str, sort_order: str):
  """
  Sort reservations based on the provided sort_by and sort_order.
  param query: SQLAlchemy session query object.
  param sort_by: Field to sort by (e.g., 'start_time', 'end_time').
  param sort_order: Order of sorting ('asc' or 'desc').
  """
  if (sort_by == "user"):
    return query.order_by(
      getattr(User, "first_name").asc() if sort_order == "asc" else getattr(User, "first_name").desc()
    )
  elif (sort_by == "parking"):
    return query.order_by(
      getattr(ParkingLot, "name").asc() if sort_order == "asc" else getattr(ParkingLot, "name").desc()
    )
  elif (sort_by == "time"):
    return query.order_by(
      Reservation.start_time.asc() if sort_order == "asc" else Reservation.start_time.desc()
    )
  else:
    return query.order_by(
      Reservation.id.asc() if sort_order == "asc" else Reservation.id.desc()
    )

def sort_by_status(now: datetime, query: Query, sort_order: str = "asc"):
  """
  Sort reservations by status.
  """
  status_order_case = case(
    (Reservation.is_cancelled == True, 3),  # Cancelled
    (Reservation.end_time < now, 2),        # Complete
    (Reservation.start_time > now, 1),      # Upcoming
    else_=0  # Active
  ).label("status_rank")

  return query.order_by(
    status_order_case.asc() if sort_order == "asc" else status_order_case.desc(),
    Reservation.start_time.asc() if sort_order == "asc" else Reservation.start_time.desc()
  ).all()