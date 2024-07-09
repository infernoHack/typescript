import { useEffect, useState } from "react";

import { useUser } from "./context/UserContext";
import { useSocket } from "./context/SocketContext";

function Chat() {
  const [chat, setChat] = useState<object | null>(null);
  const { user, setUser } = useUser();
  const { socket } = useSocket();

  const handleSubmit = async () => {
    // Message sending logic

    socket?.emit("sendMessage", "1", "Hello");
  };

  useEffect(
    function () {
      // Read logic

      if (socket) {
        socket.on("getMessage", (message) => {
          console.log(message);
        });
      }

      return () => {
        socket?.off("getMessage");
      };
    },
    [socket]
  );

  return (
    <div>
      <p>Chat component</p>
      <button onClick={handleSubmit}>Click to send message</button>
    </div>
  );
}

export default Chat;
