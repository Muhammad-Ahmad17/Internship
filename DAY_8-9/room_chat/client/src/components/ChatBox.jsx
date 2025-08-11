import styles from "../styles/styles.module.css";
import Message from "./Message";

function ChatBox({ room, username, messages, message, setMessage, handleSend, handleLeave }) {
  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h2 className={styles.roomTitle}>Room: {room}</h2>
        <button onClick={handleLeave} className={styles.leaveButton}>Leave</button>
      </div>
      <div className={styles.messagesContainer}>
        {messages.map((msg, idx) => {
          let type = 'other';
          if (msg.user.toLowerCase() === 'system') type = 'system'; // Case-insensitive check
          else if (msg.user === username) type = 'self';
          console.log(`User: ${msg.user}, Username: ${username}, Type: ${type}`);
          return (
            <Message
              key={idx}
              user={msg.user}
              text={msg.text}
              time={msg.time}
              type={type}
            />
          );
        })}
      </div>
      <div className={styles.inputRow}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className={styles.input}
        />
        <button onClick={handleSend} className={styles.sendButton}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;