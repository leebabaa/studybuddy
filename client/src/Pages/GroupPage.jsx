import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWebSocket } from "../context/socketContext";

const GroupPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [storedMessages, setStoredMessages] = useState([]);
  const { chatMessages, sendMessage } = useWebSocket();
  const liveMessages = chatMessages[groupId] || [];
  const userId = localStorage.getItem("userId") || "user123";

  useEffect(() => {
    const fetchGroupAndMessages = async () => {
      try {
        const groupResponse = await fetch(`http://localhost:5000/api/study-groups/${groupId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!groupResponse.ok) throw new Error("Failed to fetch group");
        const groupData = await groupResponse.json();
        setGroup(groupData);

        const messagesResponse = await fetch(`http://localhost:5000/api/study-groups/${groupId}/messages`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!messagesResponse.ok) throw new Error("Failed to fetch messages");
        const messagesData = await messagesResponse.json();
        console.log("Fetched stored messages:", messagesData);
        const normalizedStoredMessages = messagesData.map((msg) => ({
          userId: msg.userId._id.toString(),
          name: msg.userId.name,
          message: msg.message,
          timestamp: msg.timestamp,
        }));
        setStoredMessages(normalizedStoredMessages);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching group or messages:", error);
        setLoading(false);
      }
    };
    fetchGroupAndMessages();
  }, [groupId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendMessage(groupId, messageInput);
      setMessageInput("");
    }
  };

  const allMessages = [...storedMessages, ...liveMessages].reduce((unique, msg) => {
    const key = `${msg.userId}-${msg.timestamp}-${msg.message}`;
    if (!unique.some((m) => `${m.userId}-${m.timestamp}-${m.message}` === key)) {
      unique.push(msg);
    }
    return unique;
  }, []);
  console.log("All messages:", allMessages);

  if (loading) return <div>Loading...</div>;
  if (!group) return <div>Group not found</div>;

  return (
    <div className="container text-white mt-5">
      <h2>{group.name} Group</h2>
      <p>{group.description}</p>
      <p>Members: {group.members.length}</p>

      <div className="chat-container mt-4">
        <h4>Group Chat</h4>
        <div
          className="chat-messages"
          style={{
            height: "300px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "10px",
            backgroundColor: "#333",
            borderRadius: "5px",
          }}
        >
          {allMessages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            allMessages.map((msg, index) => (
              <div
                key={index}
                className="message"
                style={{
                  marginBottom: "10px",
                  padding: "8px",
                  backgroundColor: msg.userId === userId ? "#007bff" : "#444",
                  borderRadius: "5px",
                  textAlign: msg.userId === userId ? "right" : "left",
                }}
              >
                <div>
                  <strong>{msg.userId === userId ? "You" : msg.name || "Unknown"}</strong>
                </div>
                <div>{msg.message}</div>
                <small style={{ color: "#ccc" }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </small>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSendMessage} className="mt-2 d-flex">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="form-control me-2"
            placeholder="Type a message..."
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupPage;