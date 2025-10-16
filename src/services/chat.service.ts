import type { AxiosInstance } from "axios";
import type {
  GetUsersResponse,
  GetMessagesResponse,
  SendMessageResponse,
  MessageData,
} from "../types/chat.types";

export class ChatService {
  constructor(private axios: AxiosInstance) {}

  async getUsers(): Promise<GetUsersResponse> {
    const { data } = await this.axios.get<GetUsersResponse>(
      "/api/messages/users",
    );
    return data;
  }

  async getMessages(userId: string): Promise<GetMessagesResponse> {
    const { data } = await this.axios.get<GetMessagesResponse>(
      `/api/messages/${userId}`,
    );
    return data;
  }

  async sendMessage(
    userId: string,
    messageData: MessageData,
  ): Promise<SendMessageResponse> {
    const { data } = await this.axios.post<SendMessageResponse>(
      `/api/messages/send/${userId}`,
      messageData,
    );
    return data;
  }

  async markMessageAsSeen(messageId: string): Promise<void> {
    await this.axios.put(`/api/messages/mark/${messageId}`);
  }

  async markAllMessagesAsSeen(userId: string): Promise<void> {
    await this.axios.put(`/api/messages/mark-all/${userId}`);
  }
}
