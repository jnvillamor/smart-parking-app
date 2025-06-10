from .auth import router as auth_router
from fastapi import FastAPI

def register_routes(app: FastAPI):
  """
  Function to register all routes in the FastAPI application.
  """
  app.include_router(auth_router)
  
  print("Routes registered successfully", flush=True)  # Debugging statement