import { Server } from "socket.io";

// export function to setup web socket server
export default function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      // to allow connections from these addresses
      origin: [
        "http://127.0.0.1:5500",
        "http://localhost:3000",
        "https://task-manager-hoaa.onrender.com",
      ],
      //   allowed methods
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });
  //to listen for new socket connections
  io.on("connection", (socket) => {
    console.log("A user connected!", socket.id);
    // to listen for task update
    socket.on("taskUpdated", (data) => {
      io.emit("taskUpdated", data); // Broadcast update
    });
    // to listen for user disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected!", socket.id);
    });
  });

  return io;
}
