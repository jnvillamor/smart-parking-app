from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.utils import get_current_user
from app.models import ParkingLot, Slot, User
from app.schema import ParkingCreate, ParkingResponseLite

router = APIRouter(
  prefix="/parking",
  tags=["Parking"]
)

@router.post("/lots", response_model=ParkingResponseLite, status_code=status.HTTP_201_CREATED)
async def create_parking_lot(
  parking_lot: ParkingCreate,
  db: Session = Depends(get_db),
  current_user: User = Depends(get_current_user)
):
  """
  Endpoint to create a new parking lot.
  """
  try:
    # Check if the user is adming
    if current_user.role != "admin":
      raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to create a parking lot."
      )
    
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
