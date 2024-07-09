import "./App.css";
import Chat from "./Chat";
import { SocketProvider } from "./context/SocketContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <>
      <UserProvider>
        <SocketProvider>
          <h1>Welcome !</h1>
          <Chat />
        </SocketProvider>
      </UserProvider>
    </>
  );
}

export default App;
