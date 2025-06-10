from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import get_config
from app.models import User
from app.schema import TokenData
from datetime import timedelta, datetime, timezone
from typing import Literal
from jwt import PyJWTError, ExpiredSignatureError
import jwt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oath2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", scheme_name="JWT")
config = get_config()

def hash_password(password: str) -> str:
  return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool: 
  return pwd_context.verify(plain_password, hashed_password)

def create_token(
  subject: User,
  expires_delta: timedelta | None = None, 
  type: Literal["access", "refresh"] = "access"
) -> TokenData:
  """
  Create a JWT token for the user.
  """
  try:
    # Default expiration for access token is 1 hour, refresh token is 1 day
    iat = datetime.now(timezone.utc)
    if expires_delta is None:
      expires_delta = timedelta(hours=1) if type == "access" else timedelta(days=1)
      expires = datetime.now(timezone.utc) + expires_delta
    
    to_encode = {
      "sub": str(subject.id),
      "role": subject.role,
      "exp": expires,
    }

    token = jwt.encode(
      to_encode, 
      config.SECRET_KEY, 
      algorithm=config.ALGORITHM
    )

    return TokenData(
      token=token,
      token_type=type,
      expires=expires,
      iat=iat
    )

  except Exception as e:
    print("Error creating token:", e, flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="Server error while creating token",
    )

async def get_current_user(token: str = Depends(oath2_scheme), db: Session = Depends(get_db)):
  """
    Dependency to get the authenticated user from the token.
  """
  try:
    payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
  except Exception as e:
    print("Error getting current user:", e, flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="Server error while retrieving user",
    )