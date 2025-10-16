import type { User } from "./auth.types";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessageData {
  text?: string;
  image?: string;
}

export interface UnseenMessages {
  [userId: string]: number;
}

export interface GetUsersResponse {
  success: boolean;
  message: string;
  users: User[];
  unseenMessages: UnseenMessages;
}

export interface GetMessagesResponse {
  success: boolean;
  message: string;
  messages: Message[];
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  newMessage: Message;
}

export interface ChatContextValue {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  unseenMessages: UnseenMessages;
  isLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: MessageData) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  setUnseenMessages: React.Dispatch<React.SetStateAction<UnseenMessages>>;
  markMessagesAsSeen: (userId: string) => Promise<void>;
}
