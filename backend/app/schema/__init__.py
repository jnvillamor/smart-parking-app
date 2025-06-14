from .user import UserBase, UserCreate, UserResponse, UserProfile, UpdatePassword
from .auth import LoginResponse, TokenData, TokenPayload
from .parking import ParkingBase, ParkingCreate, ParkingResponse, PaginatedParkingResponse, ParkingSummaryResponse, ParkingResponseWithoutReservations
from .reservation import ReservationUser, ReservationCreate, ReservationResponse, PaginatedReservations, ReservationSummary

ReservationResponse.model_rebuild()