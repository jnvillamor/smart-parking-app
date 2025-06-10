from app.core.database import get_db
from app.models import User
from app.schema import UserCreate, UserResponse, UserProfile, LoginResponse
from app.utils import hash_password, verify_password, create_token, get_current_user
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(
  prefix="/auth",
  tags=["auth"],
)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
  """
  Endpoint to register a new user.
  """
  try:
    # Check if the user already exists
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
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
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="Server error while registering user",
    )

@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login_user(user: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
  """
  Endpoint to login a user and return access and refresh tokens.
  """
  try:
    # Check if the user email exists
    db_user = db.query(User).filter(User.email == user.username).first()

    if not db_user:
      raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password",
      )
    
    # Verify the password
    if not verify_password(user.password, db_user.password):
      raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password",
      )
    
    # Generate access and refresh tokens
    access_token = create_token(subject=db_user, type="access")
    refresh_token = create_token(subject=db_user, type="refresh")

    return LoginResponse(
      access_token=access_token.token,
      access_token_expires= access_token.expires,
      refresh_token=refresh_token.token,
      refresh_token_expires=refresh_token.expires,
      user=UserProfile.model_validate(db_user).model_dump()
    )
  except HTTPException as e:
    raise e
  except Exception as e:
    print("Error logging in user:", e, flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="Server error while logging in user",
    )