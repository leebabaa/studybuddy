import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Registration.css";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();
  const [ws, setWs] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:5000"); // Match server port
    setWs(websocket);

    websocket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    websocket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      websocket.close();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  const closeModal = () => {
    console.log("Close button clicked");
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.email || !formData.password) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Login successful!");
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.userId); // Store userId

        // Notify WebSocket server of login with userId
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "login", userId: data.userId }));
        } else {
          console.error("WebSocket not open yet");
        }

        if (data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/preferences");
        }
      } else {
        setMessage(data.message || "Invalid credentials.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay active" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeModal}>×</button>
        <h2 className="text-center mb-4">Login</h2>
        {message && <p className="alert alert-danger text-center">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>
        <div className="text-center mt-3">
          <p>
            Don't have an account?{" "}
            <button
              className="btn btn-link"
              onClick={() => navigate("/register")}
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          max-width: 400px;
          width: 100%;
          position: relative;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #333;
        }
        .close-btn:hover {
          color: #000;
        }
        .text-center {
          text-align: center;
        }
        .mb-3 {
          margin-bottom: 1rem;
        }
        .mb-4 {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
        .form-control {
          width: 100%;
          padding: 8px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
        .btn {
          padding: 10px;
          font-size: 16px;
          cursor: pointer;
        }
        .btn-primary {
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
        }
        .btn-primary:hover {
          background-color: #0056b3;
        }
        .btn-primary:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }
        .btn-link {
          background: none;
          border: none;
          color: #007bff;
          text-decoration: underline;
          padding: 0;
        }
        .btn-link:hover {
          color: #0056b3;
        }
        .alert {
          padding: 10px;
          border-radius: 4px;
        }
        .alert-danger {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;