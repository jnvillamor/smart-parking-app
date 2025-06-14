from sqlalchemy.orm import Session
from sqlalchemy import select, func
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timezone

from app.models import Reservation, User, ParkingLot
from app.schema import ReservationCreate, ReservationResponse
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
