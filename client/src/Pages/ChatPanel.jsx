import React, { useState, useEffect } from "react";
import { connectUser, createOrJoinChannel, sendMessage, receiveMessages } from "../services/sendbirdService";

const ChatPanel = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const user = await connectUser(userId, userId);
        console.log("Connected as:", user);

        const chatChannel = await createOrJoinChannel("classroom_chat");
        setChannel(chatChannel);

        receiveMessages(chatChannel, (newMsg) => {
          setMessages((prev) => [...prev, { sender: newMsg.sender.nickname, text: newMsg.message }]);
        });
      } catch (error) {
        console.error("Chat initialization failed:", error);
      }
    };

    initializeChat();
  }, [userId]);

  const handleSend = async () => {
    if (newMessage.trim() === "" || !channel) return;
    
    try {
      const message = await sendMessage(channel, newMessage);
      setMessages((prev) => [...prev, { sender: "Me", text: message.message }]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div
      className="chat-panel"
      style={{
        position: "fixed",
        right: "0",
        top: "60px", // Ensures it doesn't overlap navbar
        height: "calc(100vh - 60px)",
        width: "300px",
        backgroundColor: "#222",
        color: "white",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "-5px 0 10px rgba(0,0,0,0.5)",
      }}
    >
      <h4 className="text-center">💬 Live Chat</h4>

      {/* Chat Messages */}
      <div
        className="chat-messages"
        style={{
          flex: "1",
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#333",
          borderRadius: "8px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "8px" }}>
            <strong style={{ color: msg.sender === "Me" ? "limegreen" : "cyan" }}>
              {msg.sender}:
            </strong>{" "}
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="chat-input" style={{ display: "flex", marginTop: "10px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: "1",
            padding: "8px",
            borderRadius: "5px",
            border: "none",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            marginLeft: "5px",
            backgroundColor: "limegreen",
            color: "black",
            padding: "8px 12px",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
