export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  last_login: string;
  last_seen: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedUsers {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  users: UserProfile[];
}

export interface UserSummary {
  total_users: number;
  active_users: number;
  inactive_users: number;
  admin_users: number;
}

export interface UserDashboardData {
  all_active_reservations: number;
  all_upcoming_reservations: number;
  all_reservation_current_month: number;
  total_spent_current_month: number;
  ave_duration_per_reservation: number;
  recent_reservations: Reservation[];
}

export interface UserReservations {
  all_reservation_count: number;
  active_reservation_count: number;
  past_reservation_count: number;
  upcoming_reservation_count: number;
  total_spent: number;
  upcoming_reservations: Reservation[];
  active_reservations: Reservation[];
  past_reservations: Reservation[];
}

export interface Notification {
  id: number
  user_id: number
  message: string
  created_at: string
  is_read: boolean
  user: UserProfile;
}

export interface UserNotifications {
  read_notifications: Notification[];
  unread_notifications: Notification[];
  all_notifications_count: number;
  unread_notifications_count: number;
  read_notifications_count: number;
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

export interface PaginatedParkingLocations {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  parking_lots: ParkingLocation[];
}

export interface Reservation {
  id: number;
  parking_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  is_cancelled: boolean;
  created_at: string;
  updated_at: string;
  user: UserProfile;
  parking: ParkingLocation;
  duration_hours: number; // in hours
  status: 'Active' | 'Completed' | 'Cancelled' | 'Upcoming';
  total_cost: number;
}

export interface ReservationSummary {
  total_reservations: number;
  total_active_reservations: number;
  total_completed_reservations: number;
  total_upcoming_reservations: number;
}

export interface PaginatedReservations {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  reservations: Reservation[];
}

export interface AdminSummary {
  total_users: number;
  total_active_parking: number;
  total_reservations: number;
  total_revenue: number;
  new_users_today: number;
  new_parking_lots_today: number;
  new_reservations_today: number;
  new_revenue_today: number;
}
