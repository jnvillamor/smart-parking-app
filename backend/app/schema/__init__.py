from .user import UserBase, UserCreate, UserResponse, UserProfile, UpdatePassword, AdminUserSummary, PaginatedUsers, UserDashboardSummary
from .auth import LoginResponse, TokenData, TokenPayload
from .parking import ParkingBase, ParkingCreate, ParkingResponse, PaginatedParkingResponse, ParkingSummaryResponse, ParkingResponseWithoutReservations
from .reservation import ReservationUser, ReservationCreate, ReservationResponse, PaginatedReservations, ReservationSummary
from .admin import DashboardSummary 

ReservationResponse.model_rebuild()
UserDashboardSummary.model_rebuild()