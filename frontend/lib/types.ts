export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse { 
  access_token: string;
  access_token_expires: string;
  refresh_token: string;
  refresh_token_expires: string;
  user: UserProfile;
}

export interface ParkingSummary {
  total_parking_lots: number;
  total_active_parking_lots: number;
  total_available_slots: number;
  total_reserved_slots: number;
}


export interface ParkingLocation {
  id: number;
  name: string;
  location: string;
  total_slots: number;
  rate: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  available_slots: number;
  active_reservations?: [];
}

export interface ParginatedParkingLocations {
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_previous: boolean;
  parking_lots: ParkingLocation[];
}