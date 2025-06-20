from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Notification, User
from app.schema import NotificationBase, NotificationResponse
from app.utils import get_current_user

router = APIRouter(
  prefix="/notifications",
  tags=["notifications"],
)

@router.get("/{user_id}", response_model=NotificationResponse, status_code=status.HTTP_200_OK)
def get_notifications(
  user_id: int,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
  """
  Retrieve all notifications for the current user.
  """
  try:
    if current_user.id != user_id:
      raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to access these notifications.")
    
    all_notifications = db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc())
    all_notifications_count = all_notifications.count()

    # Read notifs
    read_notifications = all_notifications.filter(Notification.is_read == True).all()
    read_notifications_count = len(read_notifications)

    # Unread notifs
    unread_notifications = all_notifications.filter(Notification.is_read == False).order_by(Notification.created_at.desc()).all()
    unread_notifications_count = len(unread_notifications)

    return NotificationResponse(
      read_notifications=read_notifications,
      unread_notifications=unread_notifications,
      all_notifications_count=all_notifications_count,
      read_notifications_count=read_notifications_count,
      unread_notifications_count=unread_notifications_count
    ).model_dump()
    
  except HTTPException as e:
    print(f"HTTPException: {e.detail}")
    raise e
  except Exception as e:
    print(f"Unexpected error: {str(e)}")
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.patch("/{notification_id}/toggle-read", response_model=NotificationBase, status_code=status.HTTP_200_OK)
def mark_notification_as_read(
  notification_id: int,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
  """
  Toggle the read status of a notification for the current user.
  """
  try:
    notif = db.query(Notification).filter(
      Notification.id == notification_id,
      Notification.user_id == current_user.id
    ).first()
    
    if not notif:
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found.")
    
    notif.is_read = not notif.is_read 
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

@router.patch("/{user_id}/mark-all-read", status_code=status.HTTP_200_OK)
def mark_all_notifications_as_read(
  user_id: int,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
  """
  Mark all notifications as read for the current user.
  """
  try:
    if current_user.id != user_id:
      raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to mark these notifications as read.")
      
    notifs = db.query(Notification).filter(Notification.user_id == current_user.id, Notification.is_read == False).all()
    
    for notif in notifs:
      notif.is_read = True
    
    db.commit()
    
    return {"message": "All notifications marked as read."}
  except HTTPException as e:
    db.rollback()
    print(f"HTTPException: {e.detail}")
    raise e
  except Exception as e:
    db.rollback()
    print(f"Unexpected error: {str(e)}")
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
  notification_id: int,
  db: Session = Depends(get_db),
  current_user: int = Depends(get_current_user)
):
  """
  Delete a notification for the current user.
  """
  try:
    notif = db.query(Notification).filter(
      Notification.id == notification_id,
      Notification.user_id == current_user.id
    ).first()
    
    if not notif:
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found.")
    
    db.delete(notif)
    db.commit()
    
    return {"message": "Notification deleted successfully."}
  except HTTPException as e:
    db.rollback()
    print(f"HTTPException: {e.detail}")
    raise e
  except Exception as e:
    db.rollback()
    print(f"Unexpected error: {str(e)}")
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))