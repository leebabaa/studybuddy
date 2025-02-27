import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.mjs";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import studyGroupRoutes from "./routes/studyGroupRoutes.js";
import ChatMessage from "./models/chatMessage.js";
import User from "./models/userModel.js"; // Import User model
import { WebSocketServer } from "ws";
import http from "http";

dotenv.config();

if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI is missing in your .env file");
  process.exit(1);
}

connectDB();

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/study-groups", studyGroupRoutes);

app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: "Route not found" });
});

const wss = new WebSocketServer({ server });
let activeUsers = new Set();
const groupClients = new Map();

wss.on("connection", (ws) => {
  console.log("New WebSocket client connected");
  ws.send(JSON.stringify({ type: "activeUsers", count: activeUsers.size }));

  ws.on("message", async (message) => {
    const messageStr = message.toString();
    console.log("Received message:", messageStr);
    try {
      const data = JSON.parse(messageStr);
      if (data.type === "login" && data.userId) {
        activeUsers.add(data.userId);
        console.log(`User ${data.userId} logged in. Active users: ${activeUsers.size}`);
        broadcastActiveUsers();
      } else if (data.type === "logout" && data.userId) {
        activeUsers.delete(data.userId);
        console.log(`User ${data.userId} logged out. Active users: ${activeUsers.size}`);
        broadcastActiveUsers();
      } else if (data.type === "chatMessage" && data.groupId && data.userId && data.message) {
        // Save message to MongoDB
        const chatMessage = new ChatMessage({
          groupId: data.groupId,
          userId: data.userId,
          message: data.message,
          timestamp: data.timestamp,
        });
        await chatMessage.save();
        console.log("Saved chat message:", chatMessage);

        // Fetch user's name
        const user = await User.findById(data.userId).select("name");
        const senderName = user ? user.name : "Unknown";

        // Associate client with group
        if (!groupClients.has(data.groupId)) {
          groupClients.set(data.groupId, new Set());
        }
        groupClients.get(data.groupId).add(ws);

        // Broadcast chat message with name
        const groupMessage = JSON.stringify({
          type: "chatMessage",
          groupId: data.groupId,
          userId: data.userId,
          name: senderName, // Include name
          message: data.message,
          timestamp: data.timestamp,
        });
        groupClients.get(data.groupId).forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(groupMessage);
          }
        });
      } else {
        console.warn("Invalid message:", data);
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
    groupClients.forEach((clients) => clients.delete(ws));
    broadcastActiveUsers();
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

function broadcastActiveUsers() {
  const message = JSON.stringify({ type: "activeUsers", count: activeUsers.size });
  console.log("Broadcasting:", message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}, WebSocket on ws://localhost:${PORT}`)
);