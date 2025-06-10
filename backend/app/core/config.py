from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class BaseConfig(BaseSettings):
  """
    Base configuration class for the application.
  """
  APP_NAME: str = "Smart Parking App API"
  DB_URL: str
  SECRET_KEY: str = "your-secret-key"
  ALGORITHM: str = "HS256"
  ENVIRONMENT: str = "development"  # or "production"
  ADMIN_EMAIL: str = "admin@example.com"
  ADMIN_PASSWORD: str = "admin_password"

  model_config = SettingsConfigDict(
    env_file=".env",
  )

class DevelopmentConfig(BaseConfig):
  """
    Configuration for the development environment.
  """
  DEBUG: bool = True
  ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

class ProductionConfig(BaseConfig):
  """
    Configuration for the production environment.
  """
  DEBUG: bool = False
  ALLOWED_ORIGINS: list[str]

def get_config():
  """
    Returns the appropriate configuration based on the environment.
  """
  env = os.getenv("ENVIRONMENT", "development").lower()
  if env == "production":
    return ProductionConfig()
  else:
    return DevelopmentConfig()
