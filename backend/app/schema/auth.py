from pydantic import BaseModel
from datetime import datetime, timezone
from .user import UserProfile

class LoginResponse(BaseModel):
  access_token: str
  access_token_expires: int 
  refresh_token: str
  refresh_token_expires: int 
  user: UserProfile

class TokenData(BaseModel):
  token: str
  token_type: str
  expires: int
  iat: datetime = datetime.now(timezone.utc)

class TokenPayload(BaseModel):
  sub: str
  role: str
  exp: int