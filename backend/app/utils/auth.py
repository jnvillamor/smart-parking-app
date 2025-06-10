from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import get_config
import jwt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oath2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", scheme_name="JWT")
config = get_config()

def hash_password(password: str) -> str:
  return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool: 
  return pwd_context.verify(plain_password, hashed_password)

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