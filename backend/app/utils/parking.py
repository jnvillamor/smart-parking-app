from sqlalchemy.orm import Session, selectinload
from typing import List

from app.models import ParkingLot, Reservation
from app.schema import ParkingResponseLite, ParkingResponseDetail, ReservationUser
from datetime import datetime, timezone

def get_parking_lots_with_available_slots(db: Session, offset: int, limit: int, detailed: bool) -> List[dict]:
  """
  Helper function to build a response for parking lots with available slots.
  param parking_lots: List of parking lot objects.
  """

  query = db.query(ParkingLot).options(
    selectinload(ParkingLot.reservations).selectinload(Reservation.user)
  )

  parking_lots = query.offset(offset).limit(limit).all()
  now = datetime.now(timezone.utc)
  results = []

  for lot in parking_lots:
    active_reservations = [ 
      res for res in lot.reservations if res.start_time <= now <= res.end_time or res.start_time > now
    ]
  
    available_slots = lot.total_slots - len(active_reservations)

    setattr(lot, 'available_slots', available_slots)
    base_response = ParkingResponseLite.model_validate(lot).model_dump()

    if detailed:
      base_response['active_reservation'] = [
        ReservationUser.model_validate(res.user).model_dump() for res in active_reservations
      ]
      results.append(ParkingResponseDetail.model_validate(base_response).model_dump())
    else:
      results.append(base_response)
    
  return results

def is_parking_full(now: datetime, parking_lot: ParkingLot) -> bool:
  """
  Check if the parking lot is full based on current time and reservations.
  param now: Current datetime in UTC.
  param parking_lot: ParkingLot object to check.
  """
  active_reservations = [
    res for res in parking_lot.reservations if res.start_time <= now <= res.end_time
  ]
  
  return len(active_reservations) >= parking_lot.total_slots