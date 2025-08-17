Got it 👍 You want the **deep internals** of how SSH works, not just "it encrypts the connection." Let’s break it down step by step (what happens inside SSH when you connect):

---

# 🔑 SSH Internals

### 1. **TCP Connection**

* SSH always starts over TCP, default port **22**.
* Client (`ssh user@host`) → Server (sshd listens on port 22).
* A plain TCP socket is established first. Nothing is encrypted yet.

---

### 2. **Protocol Negotiation**

* Both sides exchange protocol versions:

  ```
  SSH-2.0-OpenSSH_9.3
  SSH-2.0-<client>
  ```
* They agree to use **SSH-2** (SSH-1 is insecure & deprecated).

---

### 3. **Key Exchange (KEX)**

This is the **heart** of SSH security.

1. **Algorithm negotiation**

   * Client & server exchange supported algorithms for:

     * Key exchange (e.g., Diffie-Hellman, ECDH, Curve25519)
     * Encryption (AES, ChaCha20, etc.)
     * MAC (Message Authentication Code, e.g., HMAC-SHA2)
     * Compression (optional, zlib)

2. **Ephemeral key generation**

   * A **Diffie-Hellman (DH) or Elliptic Curve Diffie-Hellman (ECDH)** exchange happens.
   * Both sides generate temporary key pairs.
   * They exchange public values and compute a **shared secret (K)**.

3. **Session keys derived**

   * From `K` + exchanged nonces + hash function, they derive:

     * Encryption keys
     * Integrity keys
     * Initialization vectors
   * Now both sides have the same symmetric keys, without ever directly sending them.

🔒 At this point, the **channel is encrypted**.

---

### 4. **Server Authentication**

* The server sends its **host key** (RSA, Ed25519, ECDSA).
* Client checks this against `~/.ssh/known_hosts`.
* If new, client warns:

  ```
  The authenticity of host ... can't be established.
  ```
* Prevents **man-in-the-middle (MITM)** attacks.

---

### 5. **User Authentication**

Now the server must check **who you are**:

1. **Password auth** (encrypted inside SSH tunnel, but weak).
2. **Public key auth**:

   * Client sends a challenge signed with its **private key**.
   * Server checks with the stored **public key (\~/.ssh/authorized\_keys)**.
   * If valid → authentication succeeds.

✅ Public key auth is stronger because:

* Private key never leaves your system.
* No password transmission.

---

### 6. **Channel Setup**

* SSH sets up **channels** inside the encrypted tunnel:

  * `session` (interactive shell, exec commands)
  * `direct-tcpip` (port forwarding)
  * `sftp`/`scp` (file transfer)
* Multiplexing allows multiple channels over the same TCP connection.

---

### 7. **Data Flow**

* Everything (keystrokes, output, file data) is:

  1. Encrypted (AES/ChaCha20).
  2. Integrity-protected with HMAC.
  3. Sent over TCP stream.

The server decrypts and verifies integrity before delivering to shell.

---

### 🔍 Internal Flow Summary

1. TCP handshake
2. SSH version exchange
3. Algorithm negotiation
4. Diffie-Hellman/ECDH key exchange → session keys
5. Server authentication (host key)
6. User authentication (password, pubkey, etc.)
7. Encrypted, multiplexed channels for commands, shell, forwarding

---

⚡ Bonus (deep internals):

* SSH actually uses **two layers**:

  * **Transport layer protocol** (handles encryption, key exchange, integrity).
  * **User authentication protocol** (password, pubkey, etc.).
  * **Connection protocol** (channels, forwarding, sessions).

---

Do you want me to **draw an internal flow diagram** (like sequence diagram with client/server arrows) so you can visualize the steps?
