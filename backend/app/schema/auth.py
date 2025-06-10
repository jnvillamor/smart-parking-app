from pydantic import BaseModel
from datetime import datetime, timezone
from .user import UserProfile

class LoginResponse(BaseModel):
  access_token: str
  access_token_expires: datetime
  refresh_token: str
  refresh_token_expires: datetime
  user: UserProfile

class TokenData(BaseModel):
  token: str
  token_type: str
  expires: datetime
  iat: datetime = datetime.now(timezone.utc)

class TokenPayload(BaseModel):
  sub: str
  role: str
  exp: datetime