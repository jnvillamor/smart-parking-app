from sqlalchemy.orm import Session
from sqlalchemy import select, String, or_
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timezone
from typing import Literal

from app.models import Reservation, User, ParkingLot
from app.schema import ReservationCreate, ReservationResponse, PaginatedReservations
from app.core.database import get_db
from app.utils import get_current_user, is_valid_request

router = APIRouter(
  prefix="/reservations",
  tags=["reservations"],
)

@router.post("/", response_model=ReservationResponse, status_code=status.HTTP_201_CREATED)
async def create_reservation(
  reservation: ReservationCreate,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
  """
  Create a new reservation.
  param reservation: ReservationCreate
  """
  now = datetime.now(timezone.utc)

  try:
    # Lock the parking lot to prevent concurrent modifications
    parking_lot = db.execute(
      select(ParkingLot)
      .where(ParkingLot.id == reservation.parking_id)
      .with_for_update()
    ).scalar_one_or_none()

    # Check if the request is valid
    is_valid_request(now, reservation, parking_lot, current_user, db)

    # Create the reservation
    new_reservation = Reservation(**reservation.model_dump())
    db.add(new_reservation)
    db.commit()
    db.refresh(new_reservation)

    # Return the created reservation
    return ReservationResponse.model_validate(new_reservation).model_dump()
  except HTTPException as e:
    db.rollback()
    print(f"Validation error: {e.detail}", flush=True)
    raise e
  except Exception as e:
    db.rollback()
    print(f"Error creating reservation: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Failed to create reservation. Please check your input and try again."
    )

@router.get("/", response_model=PaginatedReservations, status_code=status.HTTP_200_OK)
async def get_reservations(
  page: int = 1,
  limit: int = 10,
  term: str = None,
  status: Literal["active", "upcoming", "completed", "cancelled"] = None, 
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
  """
  Get a paginated list of reservations. \n
  param page: Page number for pagination\n
  param limit: Number of reservations per page \n
  param term: Search term to filter reservations by id, name, or parking lot name \n
  param status: Filter reservations by status (active, upcoming, completed, cancelled)
  """

  try:
    query = db.query(Reservation).join(Reservation.user).join(Reservation.parking).filter(
      or_(
        Reservation.id.cast(String).ilike(f"%{term}%") if term else True,
        User.first_name.ilike(f"%{term}%") | User.last_name.ilike(f"%{term}%") if term else True,
        ParkingLot.name.ilike(f"%{term}%") if term else True,
      ),
      Reservation.is_cancelled == (status == "cancelled") if status == "cancelled" else True,
      (Reservation.start_time <= datetime.now(timezone.utc) <= Reservation.end_time) if status == "active" else True,
      (Reservation.start_time > datetime.now(timezone.utc)) if status == "upcoming" else True,
      (Reservation.end_time < datetime.now(timezone.utc)) if status == "completed" else True
    )

    total = query.count()
    total_pages = (total + limit - 1) // limit
    reservations = query.order_by(Reservation.start_time.desc()).offset((page - 1) * limit).limit(limit).all()

    return PaginatedReservations(
      reservations=reservations,
      total=total,
      page=page,
      limit=limit,
      total_pages=total_pages,
    ).model_dump()

  except HTTPException as e:
    print(f"Validation error: {e.detail}", flush=True)
    raise e
  except Exception as e:
    print(f"Error retrieving reservations: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Failed to retrieve reservations. Please try again later."
    )

# @router.get("/summary")