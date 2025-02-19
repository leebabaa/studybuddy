import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark transparent-navbar">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src="https://cdn3.iconfinder.com/data/icons/linecons-free-vector-icons-pack/32/study-64.png"
            style={{ height: 50 }}
            alt="Study Buddy Logo"
          />
        </Link>

        {/* Mobile Menu Toggle */}
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

        {/* Navbar Links */}
        <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link hover-effect" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link hover-effect" to="/landing">Landing Page</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link hover-effect" to="/yourbuddy">Your Buddy</Link> {/* This is the link to YourBuddy */}
            </li>
            <li className="nav-item">
              <Link className="nav-link hover-effect" to="/study-groups">Study Groups</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link hover-effect" to="/courses">Courses</Link>
            </li>
          </ul>

          {/* Profile Icon */}
          <div className="d-flex align-items-center">
            <img
              src="https://cdn2.iconfinder.com/data/icons/user-interface-line-38/24/Untitled-5-19-256.png"
              className="profile-icon"
              alt="Profile"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;