import { Server } from "socket.io";
import "dotenv/config";

const CLIENT_URL = process.env.CLIENT_URL;

console.log(CLIENT_URL);

interface ServerToClientEvents {
  getMessage: (message: string) => void;
}

interface ClientToServerEvents {
  newUser: (userId: string) => void;
  sendMessage: (receiverId: string, message: string) => void;
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    origin: CLIENT_URL,
  },
});

const onlineUsers = new Map();

const addUser = (userId: string, socketId: string) => {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, socketId);
  }
};

const getUser = (userId: string) => {
  return onlineUsers.get(userId);
};

const removeUser = (socketId: string) => {
  for (const [userId, sktId] of onlineUsers) {
    if (sktId === socketId) {
      onlineUsers.delete(userId);
      break;
    }
  }
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId: string) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", (receiverId, message) => {
    // Find socket Id of the receiver
    const receiver = getUser(receiverId);

    // Send the message
    io.to(receiver).emit("getMessage", message);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

// PORT at which the server is started
io.listen(4000);
