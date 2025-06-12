from .auth import router as auth_router
from .parking import router as parking_router
from .reservation import router as reservation_router
from .user import router as user_router
from fastapi import FastAPI

def register_routes(app: FastAPI):
  """
  Function to register all routes in the FastAPI application.
  """
  app.include_router(auth_router)
  app.include_router(parking_router)
  app.include_router(reservation_router)
  app.include_router(user_router)
  
  print("Routes registered successfully", flush=True)  # Debugging statement