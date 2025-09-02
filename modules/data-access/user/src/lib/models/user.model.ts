export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  full_name?: string;
  phone?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: 'admin' | 'user' | 'moderator';
  full_name?: string;
  phone?: string;
}

export interface UpdateUserRequest {
  id: string;
  email?: string;
  role?: 'admin' | 'user' | 'moderator';
  is_active?: boolean;
  full_name?: string;
  phone?: string;
}

export interface UserFilters {
  role?: 'admin' | 'user' | 'moderator';
  is_active?: boolean;
  search?: string;
}
