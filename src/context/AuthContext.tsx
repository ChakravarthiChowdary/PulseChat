import { createContext, useEffect, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";
import type {
  User,
  AuthContextValue,
  LoginCredentials,
  UpdateProfilePayload,
  AuthState,
} from "../types/auth.types";
import { StorageUtils } from "../utils/storage.utils";
import { ErrorUtils } from "../utils/error.utils";
import { AuthService } from "../services/auth.service";
import { SocketService } from "../services/socket.service";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(StorageUtils.getToken());
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize services
  const authService = new AuthService();
  const socketService = new SocketService();

  // ============================================================================
  // Authentication Check
  // ============================================================================

  const checkAuth = async (): Promise<void> => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await authService.checkAuth();

      if (data.success && data.user) {
        setAuthUser(data.user);
        connectSocket(data.user);
      } else {
        handleInvalidAuth();
      }
    } catch (error) {
      const errorMessage = ErrorUtils.handleApiError(error);
      console.error("Auth check failed:", errorMessage);
      handleInvalidAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvalidAuth = (): void => {
    StorageUtils.removeToken();
    setToken(null);
    setAuthUser(null);
    authService.removeAuthToken();
  };

  // ============================================================================
  // Login Handler
  // ============================================================================

  const login = async (
    state: AuthState,
    credentials: LoginCredentials,
  ): Promise<void> => {
    try {
      const data = await authService.login(state, credentials);

      if (data.success && data.token) {
        const user = data.userData || data.user;

        if (!user) {
          throw new Error("User data not received from server");
        }

        setAuthUser(user);
        connectSocket(user);

        authService.setAuthToken(data.token);
        setToken(data.token);
        StorageUtils.setToken(data.token);

        toast.success(data.message || "Logged in successfully");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      const errorMessage = ErrorUtils.handleApiError(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // ============================================================================
  // Logout Handler
  // ============================================================================

  const logout = async (): Promise<void> => {
    try {
      socketService.disconnect();

      StorageUtils.removeToken();
      setToken(null);
      setAuthUser(null);
      setOnlineUsers([]);
      setSocket(null);
      authService.removeAuthToken();

      toast.success("Logged out successfully");
    } catch (error) {
      const errorMessage = ErrorUtils.handleApiError(error);
      console.error("Logout error:", errorMessage);
      toast.error("Error during logout");
    }
  };

  // ============================================================================
  // Profile Update Handler
  // ============================================================================

  const updateProfile = async (
    payload: UpdateProfilePayload,
  ): Promise<void> => {
    try {
      const data = await authService.updateProfile(payload);

      if (data.success && data.user) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message || "Profile update failed");
      }
    } catch (error) {
      const errorMessage = ErrorUtils.handleApiError(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // ============================================================================
  // Socket Connection Handler
  // ============================================================================

  const connectSocket = (userData: User): void => {
    const newSocket = socketService.connect(userData, (userIds: string[]) => {
      setOnlineUsers(userIds);
    });

    if (newSocket) {
      setSocket(newSocket);
    }
  };

  // ============================================================================
  // Effects
  // ============================================================================

  useEffect(() => {
    if (token) {
      authService.setAuthToken(token);
    }
    checkAuth();

    return () => {
      socketService.disconnect();
    };
  }, []);

  // ============================================================================
  // Context Value
  // ============================================================================

  const value: AuthContextValue = {
    authUser,
    onlineUsers,
    socket,
    isAuthenticated: !!authUser,
    isLoading,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
