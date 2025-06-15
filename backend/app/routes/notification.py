from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models import Notification
from app.schema import NotificationBase
from app.utils import get_current_user

router = APIRouter(
  prefix="/notifications",
  tags=["notifications"],
)

@router.get("/", response_model=List[NotificationBase], status_code=status.HTTP_200_OK)
def get_notifications(
  db: Session = Depends(get_db),
  current_user: int = Depends(get_current_user)
):
  """
  Retrieve all notifications for the current user.
  """
  try:
    notifs = db.query(Notification).filter(Notification.user_id == current_user.id).all()
    if not notifs:
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No notifications found for the user.")
    
    return [
      NotificationBase.model_validate(notif).model_dump() for notif in notifs
    ]
  except HTTPException as e:
    print(f"HTTPException: {e.detail}")
    raise e
  except Exception as e:
    print(f"Unexpected error: {str(e)}")
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.patch("/{notification_id}", response_model=NotificationBase, status_code=status.HTTP_200_OK)
def mark_notification_as_read(
  notification_id: int,
  db: Session = Depends(get_db),
  current_user: int = Depends(get_current_user)
):
  """
  Mark a notification as read for the current user.
  """
  try:
    notif = db.query(Notification).filter(
      Notification.id == notification_id,
      Notification.user_id == current_user.id
    ).first()
    
    if not notif:
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found.")
    
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    
    return NotificationBase.model_validate(notif).model_dump()
  except HTTPException as e:
    db.rollback()
    print(f"HTTPException: {e.detail}")
    raise e
  except Exception as e:
    db.rollback()
    print(f"Unexpected error: {str(e)}")
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))