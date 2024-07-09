import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { useUser } from "./UserContext";

type SocketContextType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  setSocket: React.Dispatch<
    React.SetStateAction<Socket<
      ServerToClientEvents,
      ClientToServerEvents
    > | null>
  >;
};

type SocketProviderProps = {
  children: React.ReactNode;
};

interface ServerToClientEvents {
  getMessage: (message: string) => void;
}

interface ClientToServerEvents {
  newUser: (userId: string) => void;
  sendMessage: (receiverId: string, message: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  setSocket: () => {},
});

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  const { user } = useUser();

  useEffect(function () {
    setSocket(io("http://localhost:4000"));
  }, []);

  useEffect(
    function () {
      if (socket && user) {
        socket.emit("newUser", user?.id);
      }
    },
    [socket, user]
  );

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error("Can't access socket context outside of its scope");
  }

  return context;
}
