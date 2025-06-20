from sqlalchemy.orm import selectinload

from app.models import ParkingLot
from datetime import datetime

def is_parking_full(now: datetime, parking_lot: ParkingLot) -> bool:
  """
  Check if the parking lot is full based on current time and reservations.
  param now: Current datetime in UTC.
  param parking_lot: ParkingLot object to check.
  """
  active_reservations = [
    res for res in parking_lot.reservations if res.end_time > now and res.is_cancelled is False
  ]
  
  return len(active_reservations) >= parking_lot.total_slots