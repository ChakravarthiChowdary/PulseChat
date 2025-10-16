import { axios } from "../config/axios.config";
import type {
  AuthResponse,
  LoginCredentials,
  UpdateProfilePayload,
  AuthState,
} from "../types/auth.types";

export class AuthService {
  async checkAuth(): Promise<AuthResponse> {
    const { data } = await axios.get<AuthResponse>("/api/auth/check");
    return data;
  }

  async login(
    state: AuthState,
    credentials: LoginCredentials,
  ): Promise<AuthResponse> {
    const { data } = await axios.post<AuthResponse>(
      `/api/auth/${state}`,
      credentials,
    );
    return data;
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<AuthResponse> {
    const { data } = await axios.put<AuthResponse>(
      "/api/auth/update-profile",
      payload,
    );
    return data;
  }

  setAuthToken(token: string): void {
    axios.defaults.headers.common["token"] = token;
  }

  removeAuthToken(): void {
    delete axios.defaults.headers.common["token"];
  }
}
