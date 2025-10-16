import { Socket } from "socket.io-client";
import type { Message } from "../types/chat.types";

export class SocketMessageService {
  constructor(private socket: Socket | null) {}

  subscribeToNewMessages(callback: (message: Message) => void): void {
    if (!this.socket) return;

    this.socket.on("newMessage", callback);
  }

  unsubscribeFromNewMessages(): void {
    if (!this.socket) return;

    this.socket.off("newMessage");
  }

  emitTyping(receiverId: string): void {
    if (!this.socket) return;

    this.socket.emit("typing", { receiverId });
  }

  subscribeToTyping(callback: (data: { senderId: string }) => void): void {
    if (!this.socket) return;

    this.socket.on("userTyping", callback);
  }

  unsubscribeFromTyping(): void {
    if (!this.socket) return;

    this.socket.off("userTyping");
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}
