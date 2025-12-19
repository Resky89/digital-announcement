// User types
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

// Announcement types
export interface Announcement {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author?: User;
  assets?: Asset[];
  created_at: string;
  updated_at: string;
}

// Asset types
export interface Asset {
  id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  created_at: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  csrf_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  csrfToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Form types
export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
}

export interface CreateAnnouncementPayload {
  title: string;
  content: string;
}

export interface UpdateAnnouncementPayload {
  title?: string;
  content?: string;
}

