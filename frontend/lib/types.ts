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