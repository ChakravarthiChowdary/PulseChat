import { io, Socket } from "socket.io-client";
import { backendUrl } from "../config/axios.config";
import { type User } from "../types/auth.types";

export class SocketService {
  private socket: Socket | null = null;

  connect(
    userData: User,
    onOnlineUsers: (userIds: string[]) => void,
  ): Socket | null {
    // Prevent duplicate connections
    if (!userData || this.socket?.connected) {
      return this.socket;
    }

    try {
      this.socket = io(backendUrl, {
        query: {
          userId: userData._id,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.connect();

      // Listen for online users updates
      this.socket.on("getOnlineUsers", onOnlineUsers);

      // Handle connection errors
      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      // Handle disconnection
      this.socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      return this.socket;
    } catch (error) {
      console.error("Error connecting socket:", error);
      return null;
    }
  }

  disconnect(): void {
    if (this.socket?.connected) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}
