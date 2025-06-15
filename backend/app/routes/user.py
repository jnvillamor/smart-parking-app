from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db
from app.models import User
from app.schema import UserBase, UserResponse, UpdatePassword, UserSummary, PaginatedUsers
from app.utils import get_current_user, verify_password, hash_password, get_admin_user
from typing import Literal

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

@router.put("/change-password/{user_id}", status_code=status.HTTP_200_OK)
async def change_password(
  user_id: int,
  data: UpdatePassword,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
  """
  Change the password of a user. \n
  Only the user themselves can change their password. \n
  param user_id: ID of the user whose password is to be changed.
  param data: Contains the old and new password.
  """
  try:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
      return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found."
      )
    
    if user.id != current_user.id:
      return HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to change this user's password."
      )
    
    # Verify the old password
    if not verify_password(data.old_password, user.password):
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Old password is incorrect."
      )
    
    # Update the password
    user.password = hash_password(data.new_password)
    db.commit()

    return {
      "message": "Password changed successfully."
    }
  
  except HTTPException as e:
    db.rollback()
    print(f"Error changing password for user {user_id}: {e.detail}", flush=True)
    raise e
  except Exception as e:
    db.rollback()
    print(f"Error changing password for user {user_id}: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while changing the password."
    )

@router.get("/summary", response_model=UserSummary, status_code=status.HTTP_200_OK)
async def get_user_summary(
  db: Session = Depends(get_db),
  current_user: User = Depends(get_admin_user)
): 
  """
  Get a summary of users in the system. \n
  Only accessible by admin users.
  """
  try:
    total_user = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    inactive_users = db.query(User).filter(User.is_active == False).count()
    admin_users = db.query(User).filter(User.role == 'admin').count()

    return UserSummary(
      total_users=total_user,
      active_users=active_users,
      inactive_users=inactive_users,
      admin_users=admin_users
    ).model_dump()

  except HTTPException as e:
    print(f"Error fetching user summary: {e.detail}", flush=True)
    raise e
  except Exception as e:
    print(f"Error fetching user summary: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while fetching the user summary."
    )

@router.get("/", response_model=PaginatedUsers, status_code=status.HTTP_200_OK)
async def get_users(
  page: int = 1,
  limit: int = 10,
  q: str = None,
  status: Literal["active", "inactive"] = None,
  role: Literal["user", "admin"] = None,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_admin_user)
):
  """
  Get a paginated list of users. \n
  Only accessible by admin users. \n
  """

  try: 
    query = db.query(User).filter(
      or_(
        User.first_name.ilike(f"%{q}%") if q else True,
        User.last_name.ilike(f"%{q}%") if q else True,
        User.email.ilike(f"%{q}%") if q else True
      ),
      User.is_active == (status == "active") if status else True,
      User.role == role if role else True,
    )
    total = query.count()
    total_pages = (total + limit - 1) // limit
    users = query.offset((page - 1) * limit).limit(limit).all()

    return PaginatedUsers(
      users=users,
      total=total,
      page=page,
      limit=limit,
      total_pages=total_pages
    ).model_dump()

  except HTTPException as e:
    print(f"Error fetching users: {e.detail}", flush=True)
    raise e
  
  except Exception as e:
    print(f"Error fetching users: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while fetching the users."
    )
