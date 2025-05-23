import { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { useAuthContext } from "context/AuthContext";

type props = {
  handleMessage: (data: any) => void;
  channel?: string | null;
};
const { REACT_APP_BASE_API } = process.env;

const useSocket = ({ handleMessage, channel }: props) => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!REACT_APP_BASE_API || !user?.id || !channel) return;

    // Initialize socket connection
    socketRef.current = io(REACT_APP_BASE_API, {
      query: { userId: user.id }, // Pass user ID to server if needed
    });
    socketRef.current.emit("joinChannel", channel);
    // Event listener for incoming messages
    socketRef.current.on("newMessage", handleMessage);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("newMessage", handleMessage);
        socketRef.current.disconnect();
      }
    };
  }, [handleMessage, user?.id, channel]);

  const sendMessage = (message: string) => {
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", { message }); // Emit a message to the server
    }
  };

  return { sendMessage };
};

export default useSocket;
