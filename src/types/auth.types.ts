import type { Socket } from "socket.io-client";

export interface User {
  _id: string;
  email: string;
  username: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  userData?: User;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  username?: string;
}

export interface UpdateProfilePayload {
  username?: string;
  profilePicture?: string;
  email?: string;
}

export interface AuthContextValue {
  authUser: User | null;
  onlineUsers: string[];
  socket: Socket | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (state: AuthState, credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
}

export type AuthState = "login" | "register";

export interface ApiError {
  message: string;
  status?: number;
}
