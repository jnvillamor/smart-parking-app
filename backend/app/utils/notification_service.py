from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from datetime import timedelta
from app.models import Reservation, Notification
from app.utils import get_current_utc_time
from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()

def send_notification_for_reservation(reservation: Reservation, db: Session):
  """Create a notification instance for a reservation."""

  user_id = reservation.user_id
  now = get_current_utc_time()

  start_30 = reservation.start_time - timedelta(minutes=30)
  start_exact = reservation.start_time
  end_30 = reservation.end_time - timedelta(minutes=30)
  end_exact = reservation.end_time

  # If the resesrvation is starting in 30 minutes
  if start_30 > now:
    message = f"Your reservation for parking spot at {reservation.parking.name} is starting in 30 minutes."
    scheduler.add_job(
      send_notification_job,
      'date',
      run_date=start_30,
      args=[user_id, message, reservation, db],
      id=f"notify_start_30_{reservation.id}"
    )
  
  if start_exact > now:
    message = f"Your reservation for parking spot at {reservation.parking.name} is starting now."
    scheduler.add_job(
      send_notification_job,
      'date',
      run_date=start_exact,
      args=[user_id, message, reservation, db],
      id=f"notify_start_exact_{reservation.id}"
    )
    
  # Only create a notification if the reservation is longer than 30 minutes
  if end_30 > now and (reservation.end_time - reservation.start_time) > timedelta(minutes=30):
    message = f"Your reservation for parking spot at {reservation.parking.name} is expiring in 30 minutes."
    scheduler.add_job(
      send_notification_job,
      'date',
      run_date=end_30,
      args=[user_id, message, reservation, db],
      id=f"notify_end_30_{reservation.id}"
    )
  

  # If the reservation is ending now, send a notification
  if end_exact > now:
    message = f"Your reservation for parking spot at {reservation.parking.name} has expired."
    scheduler.add_job(
      send_notification_job,
      'date',
      run_date=end_exact,
      args=[user_id, message, reservation, db],
      id=f"notify_end_exact_{reservation.id}"
    )


def send_notification_job(user_id: int, message: str, db: Session):
  """Send a notification to a user."""
  notification = Notification(
    user_id=user_id,
    message=message,
  )

  db.add(notification)
  db.commit()
  print(f"Notification sent to user {user_id}: {message}", flush=True)
    