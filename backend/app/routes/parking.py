from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.utils import get_current_user, get_admin_user
from app.models import ParkingLot, Slot, User
from app.schema import ParkingCreate, ParkingResponseLite, ParkingResponseDetail, PaginatedParkingResponse

router = APIRouter(
  prefix="/parking",
  tags=["Parking"]
)

@router.post("/lots", response_model=ParkingResponseLite, status_code=status.HTTP_201_CREATED)
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
    db.flush() # Ensure the new lot is added to the session

    # Create slots for the new parking lot 
    slots = []
    for slot_number in range(1, parking_lot.total_slots + 1):
      slot = Slot(
        name=f"Slot {slot_number}",
        parking_lot_id=new_parking_lot.id,
      )
      slots.append(slot)
    db.add_all(slots)
    db.commit()
    db.refresh(new_parking_lot)

    return ParkingResponseLite.model_validate(new_parking_lot).model_dump()
     
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
  detailed: bool = False,
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

    # Query the parking lots
    query = db.query(ParkingLot)
    total = query.count()
    parking_lots = query.offset(offset).limit(limit).all()

    if detailed:
      # If detailed information is requested, include slots
      return PaginatedParkingResponse(
        items=[ParkingResponseDetail.model_validate(lot).model_dump() for lot in parking_lots],
        total=total,
        page=page,
        limit=limit
      )
    
    return PaginatedParkingResponse(
      items=[ParkingResponseLite.model_validate(lot).model_dump() for lot in parking_lots],
      total=total,
      page=page,
      limit=limit
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