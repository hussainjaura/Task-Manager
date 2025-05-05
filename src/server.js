// server.js
import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import taskRouter from "../routers/taskRouter.js";
import setupSocket from "./socket.js";
import http from "http";
import dotenv from "dotenv";

// load environmental variables from .env file
dotenv.config();

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// create express app and http server
const app = express();
const server = http.createServer(app);
// web socket
const io = setupSocket(server);

const PORT = process.env.PORT || 3000;

// Connect to MongoDB using mongoose
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["https://task-manager-hoaa.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// for debugging of render app:
// cors({
//   origin: [
//     "http://127.0.0.1:5500",
//     "http://localhost:3000",
//     "https://task-manager-hoaa.onrender.com",
//   ],

// Static files from different directories
app.use(express.static(path.join(__dirname, "../structure")));
app.use("/styling", express.static(path.join(__dirname, "../styling")));
app.use("/app", express.static(path.join(__dirname, "../app")));
app.use(express.static(path.join(__dirname, "../favicon")));
app.use("/sounds", express.static(path.join(__dirname, "../sounds")));
app.use("/myPic", express.static(path.join(__dirname, "../myPic")));

// Routes
app.use("/api", taskRouter);

// Serve the HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../structure/task.html"));
});
// to start the http server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
