from app.core.database import get_db
from app.models.user import User
from app.schema import UserCreate, UserResponse
from app.utils.auth import hash_password
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(
  prefix="/auth",
  tags=["auth"],
)

@router.post("/register", response_model=UserResponse, status_code=201)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
  """
  Endpoint to register a new user.
  """
  try:
    # Check if the user already exists
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
      raise HTTPException(
        status_code=400,
        detail="User with this email already exists",
      )

    # Create a new user instance
    user.password = hash_password(user.password)

    new_user = User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserResponse.model_validate(new_user).model_dump()
    
  except HTTPException as e:
    raise e
  except Exception as e:
    print("Error registering user:", e, flush=True)
    db.rollback()
    raise HTTPException(
      status_code=500,
      detail="Server error while registering user",
    )