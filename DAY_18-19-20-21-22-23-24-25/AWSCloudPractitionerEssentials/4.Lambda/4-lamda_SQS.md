

# Simple Explanation: Lambda + SQS

## 1. What’s the Setup?

* **SQS (Simple Queue Service):** A queue where you put messages.
* **Lambda:** A function that runs code automatically whenever a new message is added to the SQS queue.

👉 So the idea is:

* You send a message → it goes into the queue → Lambda is triggered → Lambda processes it.

---

## 2. Step-by-Step Flow

1. **Create SQS Queue**

   * Think of this as a mailbox where you drop messages.
   * Example message: *“This is a test message.”*

2. **Create Lambda Function**

   * Lambda = a piece of code that reacts to messages.
   * Runtime = Node.js, Python, Java (you choose).
   * In this case, the function just **reads the message and prints it to logs**.

3. **Give Lambda Permissions**

   * Lambda needs permission to “look inside” the queue.
   * That’s why we attach the **Amazon SQS poller policy**.
   * Without this, Lambda can’t read from SQS.

4. **Add Trigger (SQS → Lambda)**

   * You connect the SQS queue to the Lambda.
   * Now, whenever a message arrives in the queue, Lambda runs automatically.

---

## 3. What Happens in Action

* You **send a message** to the queue:

  ```
  "This is a test message"
  ```
* SQS receives it → instantly tells Lambda.
* Lambda runs and processes the message:

  * Logs it into **CloudWatch** (monitoring tool).
  * Then marks the message as “done,” so it disappears from the queue.

👉 That’s why when you check the queue again → it looks empty (because Lambda already processed the messages).

---

## 4. Where Do Results Go?

* You won’t “see” results in SQS (since messages are consumed).
* Instead, check **CloudWatch Logs**:

  * You’ll see entries like:

    ```
    Processed message: This is a test message
    ```

---

## 5. Why This is Useful?

* Decouples systems (sender doesn’t care who processes).
* Auto-scales (thousands of messages → Lambda scales up).
* Pay only for usage.
* Common for **order processing, notifications, background jobs**.

---

✅ In short:

1. Put message in SQS.
2. Lambda auto-runs when message arrives.
3. Message disappears (because Lambda processed it).
4. Logs go to CloudWatch.

---
