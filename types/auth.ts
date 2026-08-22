export interface User {
  _id: string;
  name: string;
  phone: string;
  createdAt?: string;
}

export interface LoginPayload {
  phone: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
