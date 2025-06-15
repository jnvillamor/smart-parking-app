from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from datetime import datetime
from app.models import Reservation, Notification
from app.core.database import get_db
from app.utils import get_current_utc_time

def check_reservation_expirations():
  """
  Check for expired reservations and create notifications for users.
  This function runs periodically to ensure that users are notified when their reservations expire.
  """
  db_gen = get_db
  db: Session = next(db_gen())

  now = get_current_utc_time()
  try:
    reservations = db.query(Reservation).filter(
      Reservation.end_time <= now,
      Reservation.is_cancelled == False,
      Reservation.notified == False
    ).all()

    for reservation in reservations:
      notif = Notification(
        user_id = reservation.user_id,
        message = f"Your reservation for {reservation.parking.name} has expired.",
        created_at = now 
      )

      reservation.notified = True
      db.add(notif)

    db.commit()

    print(f"Checked {len(reservations)} reservations for expiration.", flush=True)
  except Exception as e:
    print(f"Error fetching reservations: {e}", flush=True)
    db.rollback()
  finally:
    db.close()
