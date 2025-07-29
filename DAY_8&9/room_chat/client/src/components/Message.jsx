import styles from "../styles/styles.module.css";
import clsx from "clsx";

function Message({ user, text, time, type }) {
  return (
    <div
      className={clsx(styles.messageWrapper, {
        [styles.self]: type === "self",
        [styles.system]: type === "system",
        [styles.other]: type === "other",
      })}
    >
      <div className={styles.messageBubble}>
        {type !== "system" && (
          <div className={styles.messageHeader}>
            <span className={styles.username}>{user}</span>
            <span className={styles.messageTime}>{time}</span>
          </div>
        )}
        <p className={styles.messageText}>{text}</p>
      </div>
    </div>
  );
}

export default Message;