import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.mjs";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import studyGroupRoutes from "./routes/studyGroupRoutes.js";
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
    origin: "http://localhost:5173", // Adjust if your frontend port differs
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.options("*", cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/study-groups", studyGroupRoutes);

// WebSocket Server for tracking active users
const wss = new WebSocketServer({ server });
let activeUsersCount = 0; // Use a counter instead of Set

wss.on("connection", (ws) => {
  console.log("New WebSocket client connected");
  ws.send(JSON.stringify({ type: "activeUsers", count: activeUsersCount }));

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type === "login" && data.userId) {
      activeUsersCount += 1; // Increment counter for each login
      console.log(`User ${data.userId} logged in. Active users: ${activeUsersCount}`);
      broadcastActiveUsers();
    } else if (data.type === "logout" && data.userId) {
      activeUsersCount = Math.max(0, activeUsersCount - 1); // Decrement, but not below 0
      console.log(`User ${data.userId} logged out. Active users: ${activeUsersCount}`);
      broadcastActiveUsers();
    }
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
    // Optionally decrement here if you track sessions, but we'll rely on logout
    broadcastActiveUsers();
  });
});

function broadcastActiveUsers() {
  const message = JSON.stringify({ type: "activeUsers", count: activeUsersCount });
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