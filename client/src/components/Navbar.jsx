import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import RegistrationForm from "../Pages/RegistrationForm";

const Navbar = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const [ws, setWs] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); // Define useNavigate

  // Fetch user details from localStorage and initialize WebSocket
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const id = localStorage.getItem("userId");
    if (email) setUserEmail(email);
    if (id) setUserId(id);

    // Initialize WebSocket
    const websocket = new WebSocket("ws://localhost:5000");
    setWs(websocket);

    websocket.onopen = () => {
      console.log("Navbar connected to WebSocket server");
      // Request initial active users count
      if (id && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({ type: "login", userId: id }));
      }
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "activeUsers") {
        setActiveUsers(data.count);
      }
    };

    websocket.onclose = () => {
      console.log("Navbar disconnected from WebSocket server");
    };

    return () => {
      websocket.close();
    };
  }, []);

  // Track page navigation and send data to backend
  useEffect(() => {
    if (userId) {
      console.log(`User ID: ${userId} navigated to ${location.pathname}`);
      fetch("http://localhost:5000/api/track-navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, page: location.pathname }),
      });
    }
  }, [location.pathname, userId]);

  // Logout function
  const handleLogout = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "logout", userId }));
    }
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    setUserEmail("");
    setUserId("");
    setShowLogout(false);
    navigate("/login"); // Now useNavigate is defined
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark transparent-navbar">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img
              src="https://cdn3.iconfinder.com/data/icons/linecons-free-vector-icons-pack/32/study-64.png"
              style={{ height: 50 }}
              alt="Study Buddy Logo"
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link hover-effect" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link hover-effect" to="/yourbuddy">Your Buddy</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link hover-effect" to="/courses">Courses</Link>
              </li>
            </ul>

            <div className="d-flex align-items-center">
              {/* Active Users Counter */}
              <div className="text-white d-flex align-items-center me-4">
                <span className="text-success me-2">🟢</span>
                Active Users: {activeUsers}
              </div>

              {/* Profile Section with User Info */}
              <div
                className="profile-section text-center"
                onMouseEnter={() => setShowLogout(true)}
                onMouseLeave={() => setShowLogout(false)}
                style={{ position: "relative", cursor: "pointer" }}
              >
                <img
                  src="https://cdn2.iconfinder.com/data/icons/user-interface-line-38/24/Untitled-5-19-256.png"
                  className="profile-icon"
                  alt="Profile"
                  style={{ display: "block", margin: "0 auto" }}
                  onClick={() => setIsModalOpen(true)}
                />
                {userEmail && (
                  <>
                    <p className="user-email mt-1" style={{ fontSize: "14px", color: "#fff" }}>
                      {userEmail}
                    </p>
                    {userId && (
                      <p className="user-id mt-1" style={{ fontSize: "12px", color: "#ccc" }}>
                        ID: {userId}
                      </p>
                    )}
                  </>
                )}
                {userEmail && showLogout && (
                  <button className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            <RegistrationForm setUserEmail={setUserEmail} />
          </div>
        </div>
      )}

      {/* CSS */}
      <style jsx>{`
        .transparent-navbar {
          background-color: rgba(0, 0, 0, 0.8);
        }
        .nav-link.hover-effect:hover {
          color: #0d6efd;
        }
        .logout-button {
          position: absolute;
          top: 50px;
          left: 50%;
          transform: translateX(-50%);
          background: #ff4444;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }
        .logout-button:hover {
          background: #cc0000;
        }
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
          z-index: 1050;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          max-width: 400px;
          width: 100%;
          position: relative;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          z-index: 1051;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default Navbar;