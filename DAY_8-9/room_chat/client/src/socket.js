import { io } from "socket.io-client";

const socket = io("https://internship-sandy-tau.vercel.app", {
  withCredentials: true,
});

export default socket;
