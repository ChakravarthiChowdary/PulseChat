import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import type {
  Message,
  ChatContextValue,
  MessageData,
  UnseenMessages,
} from "../types/chat.types";
import { ChatService } from "../services/chat.service";
import { useSocketMessages } from "../hooks/useSocketMessages";
import { ErrorUtils } from "../utils/error.utils";
import type { User } from "../types/auth.types";
import { axios } from "../config/axios.config";

interface ChatProviderProps {
  children: ReactNode;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [unseenMessages, setUnseenMessages] = useState<UnseenMessages>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { socket, authUser } = useAuth();

  // Initialize chat service (using a stable axios instance from auth)
  const chatService = new ChatService(axios);

  // Initialize socket message handling
  useSocketMessages({
    socket,
    axios,
    selectedUser,
    setMessages,
    setUnseenMessages,
  });

  // ============================================================================
  // Get All Users
  // ============================================================================

  const getUsers = useCallback(async (): Promise<void> => {
    if (!authUser) return;

    try {
      setIsLoading(true);
      const data = await chatService.getUsers();

      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      const errorMessage = ErrorUtils.handleApiError(error);
      toast.error(errorMessage);
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [authUser]);

  // ============================================================================
  // Get Messages for Selected User
  // ============================================================================

  const getMessages = useCallback(async (userId: string): Promise<void> => {
    if (!userId) {
      console.error("User ID is required to fetch messages");
      return;
    }

    try {
      setIsLoading(true);
      const data = await chatService.getMessages(userId);

      if (data.success) {
        setMessages(data.messages);

        // Clear unseen messages for this user
        setUnseenMessages((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      } else {
        toast.error(data.message || "Failed to fetch messages");
      }
    } catch (error) {
      const errorMessage = ErrorUtils.handleApiError(error);
      toast.error(errorMessage);
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================================================
  // Send Message
  // ============================================================================

  const sendMessage = useCallback(
    async (messageData: MessageData): Promise<void> => {
      if (!selectedUser) {
        toast.error("Please select a user to send a message");
        return;
      }

      if (!messageData.text?.trim() && !messageData.image) {
        toast.error("Message cannot be empty");
        return;
      }

      try {
        const data = await chatService.sendMessage(
          selectedUser._id,
          messageData,
        );

        if (data.success) {
          setMessages((prevMessages) => [...prevMessages, data.newMessage]);
        } else {
          toast.error(data.message || "Failed to send message");
        }
      } catch (error) {
        const errorMessage = ErrorUtils.handleApiError(error);
        toast.error(errorMessage);
        console.error("Failed to send message:", error);
      }
    },
    [selectedUser],
  );

  // ============================================================================
  // Mark Messages as Seen
  // ============================================================================

  const markMessagesAsSeen = useCallback(
    async (userId: string): Promise<void> => {
      try {
        await chatService.markAllMessagesAsSeen(userId);

        // Update local state
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.senderId === userId ? { ...msg, seen: true } : msg,
          ),
        );

        // Clear unseen count
        setUnseenMessages((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      } catch (error) {
        console.error("Failed to mark messages as seen:", error);
      }
    },
    [],
  );

  // ============================================================================
  // Handle Selected User Change
  // ============================================================================

  const handleSetSelectedUser = useCallback(
    (user: User | null): void => {
      setSelectedUser(user);

      if (user) {
        // Fetch messages when user is selected
        getMessages(user._id);

        // Mark messages as seen
        if (unseenMessages[user._id]) {
          markMessagesAsSeen(user._id);
        }
      } else {
        // Clear messages when no user is selected
        setMessages([]);
      }
    },
    [getMessages, markMessagesAsSeen, unseenMessages],
  );

  // ============================================================================
  // Effects
  // ============================================================================

  // Fetch users on mount
  useEffect(() => {
    if (authUser) {
      getUsers();
    }
  }, [authUser, getUsers]);

  // ============================================================================
  // Context Value
  // ============================================================================

  const value: ChatContextValue = {
    messages,
    users,
    selectedUser,
    unseenMessages,
    isLoading,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser: handleSetSelectedUser,
    setUnseenMessages,
    markMessagesAsSeen,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatContext };
