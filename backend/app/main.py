from fastapi import FastAPI
from core.config import get_config
from core.alembic_runner import run_migrations
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan event handler."""
    # Run migrations on startup
    run_migrations()
    yield

config = get_config()
def create_app() -> FastAPI:
  app = FastAPI(
    title=config.APP_NAME,
    debug=config.DEBUG
  )

  app.add_middleware(
    CORSMiddleware,
    allow_origins= config.ALLOWED_ORIGINS if config.ALLOWED_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )

  @app.get("/")
  async def read_root():
    return {"message": "Welcome to SMART PARKING SPOT API - Backend"}
  
  return app

if __name__ == "__main__":
  uvicorn.run(
    "main:create_app",
    host="0.0.0.0",
    port=8000,
    reload=config.DEBUG,
    log_level="debug" if config.DEBUG else "info",
    factory=True
  )