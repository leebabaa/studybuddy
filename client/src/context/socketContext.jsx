import React, { createContext, useContext, useState, useEffect } from "react";

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const [chatMessages, setChatMessages] = useState({});

  useEffect(() => {
    const connectWebSocket = () => {
      const websocket = new WebSocket("ws://localhost:5000");

      websocket.onopen = () => {
        console.log("WebSocket connected in WebSocketProvider");
        setWs(websocket);
      };

      websocket.onmessage = (event) => {
        console.log("WebSocket received message:", event.data);
        const data = JSON.parse(event.data);
        if (data.type === "activeUsers") {
          setActiveUsers(data.count);
        } else if (data.type === "chatMessage") {
          console.log("Received chat message for group:", data.groupId, data);
          setChatMessages((prev) => ({
            ...prev,
            [data.groupId]: [...(prev[data.groupId] || []), data], // Include name from server
          }));
        }
      };

      websocket.onclose = () => {
        console.log("WebSocket disconnected in WebSocketProvider");
        setWs(null);
        setTimeout(connectWebSocket, 1000);
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error in WebSocketProvider:", error);
      };

      return websocket;
    };

    const websocket = connectWebSocket();

    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, []);

  const sendMessage = (groupId, message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const chatMessage = {
        type: "chatMessage",
        groupId,
        userId: localStorage.getItem("userId") || "user123",
        message,
        timestamp: new Date().toISOString(),
      };
      console.log("Sending chat message:", chatMessage);
      ws.send(JSON.stringify(chatMessage));
    } else {
      console.error("WebSocket not open for sending message");
    }
  };

  const value = { ws, activeUsers, chatMessages, sendMessage };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;