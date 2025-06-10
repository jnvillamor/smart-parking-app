from fastapi import FastAPI

def create_app() -> FastAPI:
  app = FastAPI()

  @app.get("/")
  async def read_root():
    return {"message": "Welcome to SMART PARKING SPOT API - Backend"}
  
  return app

app = create_app()
