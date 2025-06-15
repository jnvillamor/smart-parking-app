from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from datetime import datetime
from app.models import Reservation, Notification
from app.core.database import get_db
from app.utils import get_current_utc_time

def check_reservation_expirations():
  db_gen = get_db
  db: Session = next(db_gen())

  now = get_current_utc_time()
  try:
    reservations = db.query(Reservation).filter(
      Reservation.expiration_time <= now,
      Reservation.status == 'active'
    ).all()

    for reservation in reservations:
      notif = Notification(
        user_id = reservation.user_id,
        message = f"Your reservation for {reservation.item_name} has expired.",
        created_at = now,
        is_read = False
      )
    
    db.add_all(reservations)
    db.commit()

    print(f"Checked {len(reservations)} reservations for expiration.", flush=True)
  except Exception as e:
    print(f"Error fetching reservations: {e}", flush=True)
    db.rollback()
  finally:
    db.close()
