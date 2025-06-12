from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import User
from app.schema import UserBase, UserResponse
from app.utils import get_current_user

router = APIRouter(
  prefix="/users",
  tags=["users"],
)

@router.put("/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def update_user(
  user_id: int,
  user_data: UserBase,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
  """
  Update user information. \n
  Only the user themselves or an admin can update user information. \n
  param user_id: ID of the user to update.
  """
  try:
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found."
      )
    
    if user.id != current_user.id:
      raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to update this user."
      )

    # Update user details
    user.email = user_data.email
    user.first_name = user_data.first_name
    user.last_name = user_data.last_name

    # Commit the changes to the database
    db.commit()
    db.refresh(user)

    return UserResponse.model_validate(user).model_dump()
  except HTTPException as e:
    print(f"Error fetching user {user_id}: {e.detail}", flush=True)
    raise e
  except Exception as e:
    db.rollback()
    print(f"Error updating user {user_id}: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while updating the user."
    )