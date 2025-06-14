from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.utils import get_current_user, get_admin_user
from app.models import ParkingLot, User, Reservation
from app.schema import ParkingCreate, ParkingResponse, PaginatedParkingResponse, ParkingSummaryResponse
from typing import Literal

router = APIRouter(
  prefix="/parking",
  tags=["Parking"]
)

@router.post("/lots", response_model=ParkingResponse, status_code=status.HTTP_201_CREATED)
async def create_parking_lot(
  parking_lot: ParkingCreate,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_admin_user)
):
  """
  Endpoint to create a new parking lot.
  param parking_lot: ParkingCreate - The details of the parking lot to be created.
  """
  try:
    # Check if the parking lot already exists
    existing_lot = db.query(ParkingLot).filter(ParkingLot.name == parking_lot.name).first()
    if existing_lot:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Parking lot with this name already exists."
      )
    
    # Create a new parking lot
    new_parking_lot = ParkingLot(**parking_lot.model_dump())
    db.add(new_parking_lot)
    db.commit()
    db.refresh(new_parking_lot)

    new_parking_lot.available_slots = new_parking_lot.total_slots  # Initialize available slots
    return ParkingResponse.model_validate(new_parking_lot).model_dump()
     
  except HTTPException as e:
    db.rollback()
    print(f"Error checking existing parking lot: {e.detail}", flush=True)
    raise e
  except Exception as e:
    db.rollback()
    print(f"Error creating parking lot: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while creating the parking lot."
    )

@router.get("/lots", response_model=PaginatedParkingResponse, status_code=status.HTTP_200_OK)
async def get_parking_lots(
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user),
  limit: int = 20,
  page: int = 1,
  name: str = None,
  status: Literal["active", "inactive", "all"] = "all",
):
  """
  Endpoint to retrieve a list of parking lots. \n
  param limit: int - The maximum number of parking lots to return. \n
  param page: int - The page number for pagination. \n
  param detailed: bool - Whether to return detailed information about the parking lots.
  """
  try:
    # Calculate offset for pagination
    offset = (page - 1) * limit

    filtered_query = db.query(ParkingLot).filter(
      ParkingLot.is_active == (status == "active") if status in ["active", "inactive"] else True,
      ParkingLot.name.ilike(f"%{name}%") if name else True
    )
    total = filtered_query.count()
    total_pages = (total + limit - 1) // limit
    lots = filtered_query.offset(offset).limit(limit).all()
    
    return PaginatedParkingResponse(
      parking_lots=lots,
      total=total,
      page=page,
      limit=limit,
      total_pages=total_pages
    ).model_dump()

  except HTTPException as e:
    print(f"Error retrieving parking lots: {e.detail}", flush=True)
    raise e
  except Exception as e:
    print(f"Error retrieving parking lots: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while retrieving parking lots."
    )

@router.get("/lots/{parking_lot_id}", response_model=ParkingResponse, status_code=status.HTTP_200_OK)
async def get_parking_lot(
  parking_lot_id: int,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  """
  Endpoint to retrieve a parking lot by its ID. \n
  param parking_lot_id: int - The ID of the parking lot to be retrieved.
  """
  try:
    # Retrieve the parking lot by ID
    parking_lot = db.query(ParkingLot).filter(ParkingLot.id == parking_lot_id).first()
    if not parking_lot:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Parking lot not found."
      )
    
    return ParkingResponse.model_validate(parking_lot).model_dump()

  except HTTPException as e:
    print(f"Error retrieving parking lot: {e.detail}", flush=True)
    raise e
  except Exception as e:
    print(f"Error retrieving parking lot: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while retrieving the parking lot."
    )

@router.put("/lots/{parking_lot_id}", response_model=ParkingResponse, status_code=status.HTTP_200_OK)
async def update_parking_lot(
  parking_lot_id: int,
  parking_lot_details: ParkingCreate,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_admin_user)
):
  """
  Endpoint to update an existing parking lot by its ID. \n
  param parking_lot_id: int - The ID of the parking lot to be updated. \n
  param parking_lot_details: ParkingCreate - The new details for the parking lot.
  """
  try:
    # Check if the parking lot exists
    parking_lot = db.query(ParkingLot).filter(ParkingLot.id == parking_lot_id).first()
    if not parking_lot:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Parking lot not found."
      )
    
    # Check if the name is being updated and if it already exists
    if parking_lot_details.name != parking_lot.name:
      existing_lot = db.query(ParkingLot).filter(ParkingLot.name == parking_lot_details.name).first()
      if existing_lot:
        raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail="Parking lot with this name already exists."
        )
    
    # Update the parking lot details
    for key, value in parking_lot_details.model_dump().items():
      setattr(parking_lot, key, value)
    
    db.commit()
    db.refresh(parking_lot)

    return ParkingResponse.model_validate(parking_lot).model_dump()
  except HTTPException as e:
    db.rollback()
    print(f"Error checking parking lot existence: {e.detail}", flush=True)
    raise e
  except Exception as e:
    db.rollback()
    print(f"Error updating parking lot: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while updating the parking lot."
    )

@router.delete("/lots/{parking_lot_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_parking_lot(
  parking_lot_id: int,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_admin_user),
):
  """
  Endpoint to delete a parking lot by its ID. \n
  param parking_lot_id: int - The ID of the parking lot to be deleted.
  """
  try:
    # Check if the parking lot exists
    parking_lot = db.query(ParkingLot).filter(ParkingLot.id == parking_lot_id).first()
    if not parking_lot:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Parking lot not found."
      )
    
    # Delete the parking lot
    db.delete(parking_lot)
    db.commit()

    return {
      "detail": "Parking lot deleted successfully."
    }

  except HTTPException as e:
    db.rollback()
    print(f"Error checking parking lot existence: {e.detail}", flush=True)
    raise e
  except Exception as e:
    db.rollback()
    print(f"Error deleting parking lot: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while deleting the parking lot."
    )

@router.get("/summary", response_model=ParkingSummaryResponse, status_code=status.HTTP_200_OK)
async def get_parking_summary(
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
  """
  Endpoint to retrieve a summary of parking lots.
  """
  try:
    query = db.query(ParkingLot)
    now = func.now()

    total_parking_lots = query.count()
    total_active_parking_lots = query.filter(ParkingLot.is_active == True).count()
    total_available_slots = db.query(func.sum(ParkingLot.total_slots)).scalar() or 0
    total_reserved_slots = db.query(Reservation).filter(
      Reservation.end_time > now,
    ).count()

    return ParkingSummaryResponse(
      total_parking_lots=total_parking_lots,
      total_active_parking_lots=total_active_parking_lots,
      total_available_slots=total_available_slots,
      total_reserved_slots=total_reserved_slots
    ).model_dump()

  except HTTPException as e:
    print(f"Error retrieving parking summary: {e.detail}", flush=True)
    raise e
  except Exception as e:
    print(f"Error retrieving parking summary: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while retrieving the parking summary."
    )

@router.patch("/lots/{parking_lot_id}/toggle-status", status_code=status.HTTP_200_OK)
async def toggle_parking_lot_status(
  parking_lot_id: int,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_admin_user),
):
  """
  Endpoint to toggle the status of a parking lot (active/inactive). \n
  param parking_lot_id: int - The ID of the parking lot whose status is to be toggled.
  """
  try:
    # Retrieve the parking lot by ID
    parking_lot = db.query(ParkingLot).filter(ParkingLot.id == parking_lot_id).first()
    if not parking_lot:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Parking lot not found."
      )
    
    # Toggle the status
    parking_lot.is_active = not parking_lot.is_active
    db.commit()
    db.refresh(parking_lot)

    return {
      "detail": "Parking lot status toggled successfully.",
      "id": parking_lot.id,
      "is_active": parking_lot.is_active
    } 

  except HTTPException as e:
    db.rollback()
    print(f"Error toggling parking lot status: {e.detail}", flush=True)
    raise e
  except Exception as e:
    db.rollback()
    print(f"Error toggling parking lot status: {e}", flush=True)
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="An error occurred while toggling the parking lot status."
    )