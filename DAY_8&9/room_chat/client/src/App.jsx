import { useEffect, useState } from "react";
import socket from "./socket";
import JoinRoom from "./components/JoinRoom";
import ChatBox from "./components/ChatBox";
import styles from "./styles/styles.module.css";

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Listen for user join notifications (system messages)
    socket.on("user-joined", (data) => {
      setMessages((prev) => [...prev, { user: "system", text: data.message, time: new Date().toLocaleTimeString() }]);
    }); 

    // Cleanup on unmount
    return () => {
      socket.off("receive-message");
      socket.off("user-joined");
    };
  }, []);

  const handleJoin = () => {
    if (username.trim() && room.trim()) {
      socket.emit("join-room", { username, room });
      setJoined(true);
    } else {
      alert("Please enter a username and room name.");
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      const time = new Date().toLocaleTimeString();
      socket.emit("send-message", { room, message, username, time });
      setMessage("");
    }
  };

  const handleLeave = () => {
    socket.emit("leave-room", { username, room });
    setJoined(false);
    setMessages([]);
    setRoom("");
    // Optionally reset username if you want users to re-enter it
    // setUsername("");
  };

  return (
    <div className={styles.container}>
      {!joined ? (
        <JoinRoom
          username={username}
          room={room}
          setUsername={setUsername}
          setRoom={setRoom}
          handleJoin={handleJoin}
        />
      ) : (
        <ChatBox
          username={username} // Added username prop
          room={room}
          messages={messages}
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          handleLeave={handleLeave}
        />
      )}
    </div>
  );
}

export default App;