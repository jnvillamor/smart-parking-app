from fastapi import FastAPI
from app.core.config import get_config
from app.utils import run_migrations, init_admin
from app.routes import register_routes
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan event handler."""
    # Run migrations on startup
    run_migrations()
    init_admin()
    yield

config = get_config()
def create_app() -> FastAPI:
  app = FastAPI(
    title=config.APP_NAME,
    debug=config.DEBUG,
    lifespan=lifespan,
  )

  app.add_middleware(
    CORSMiddleware,
    allow_origins= config.ALLOWED_ORIGINS if config.ALLOWED_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )

  # Register routes
  register_routes(app)

  @app.get("/")
  async def read_root():
    return {"message": "Welcome to SMART PARKING SPOT API - Backend"}
  
  return app

app = create_app()