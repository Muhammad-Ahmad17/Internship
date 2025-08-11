  import styles from "../styles/styles.module.css";

  function JoinRoom({ username, room, setUsername, setRoom, handleJoin }) {
    return (
      <div className={styles.joinContainer}>
        <h2 className={styles.title}>Join a Chat Room</h2>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleJoin} className={styles.joinButton}>
          Join Room
        </button>
      </div>
    );
  }

  export default JoinRoom;
