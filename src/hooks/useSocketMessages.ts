import { useEffect, useCallback } from "react";
import { Socket } from "socket.io-client";
import type { AxiosInstance } from "axios";
import type { Message, UnseenMessages } from "../types/chat.types";
import { SocketMessageService } from "../services/socket-message.service";
import type { User } from "../types/auth.types";

interface UseSocketMessagesProps {
  socket: Socket | null;
  axios: AxiosInstance;
  selectedUser: User | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setUnseenMessages: React.Dispatch<React.SetStateAction<UnseenMessages>>;
}

export const useSocketMessages = ({
  socket,
  axios,
  selectedUser,
  setMessages,
  setUnseenMessages,
}: UseSocketMessagesProps) => {
  const socketService = new SocketMessageService(socket);

  const handleNewMessage = useCallback(
    (newMessage: Message) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        // Message from currently selected user - mark as seen
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Mark message as seen on the server
        axios.put(`/api/messages/mark/${newMessage._id}`).catch((error) => {
          console.error("Failed to mark message as seen:", error);
        });
      } else {
        // Message from another user - increment unseen count
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]:
            (prevUnseenMessages[newMessage.senderId] || 0) + 1,
        }));
      }
    },
    [selectedUser, setMessages, setUnseenMessages, axios],
  );

  useEffect(() => {
    if (!socket) return;

    socketService.subscribeToNewMessages(handleNewMessage);

    return () => {
      socketService.unsubscribeFromNewMessages();
    };
  }, [socket, selectedUser, handleNewMessage]);

  return socketService;
};
