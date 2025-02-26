import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Import the updated Navbar
import Courses from "./Pages/Courses";
import CourseContent from "./Pages/CourseContent";
import CourseDescription from "./Pages/CourseDescription";
import YourBuddy from "./Pages/YourBuddy";
import Home from "./Pages/Home";
import UserPreferencesForm from "./Pages/userPreferencesForm";
import AdminDashboard from "./Pages/AdminDashboard";
import LoginForm from "./Pages/LoginForm";
import Classroom from "./Pages/Classroom";
import RegistrationForm from "./Pages/RegistrationForm";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// NavigationTracker component for tracking user navigation
const NavigationTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      console.log(`User ID: ${userId} navigated to ${location.pathname}`);

      // Send tracking data to the backend
      fetch("http://localhost:5000/api/track-navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, page: location.pathname }),
      });
    }
  }, [location]);

  return null; // No UI needed
};

function App() {
  return (
    <Router>
      <div>
        <Navbar /> {/* Replace Layout with Navbar */}
        <div style={{ paddingTop: "70px" }}> {/* Offset for fixed navbar */}
          <NavigationTracker /> {/* Keep the tracker */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/yourbuddy" element={<YourBuddy />} />
            <Route path="/classroom" element={<Classroom />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/course/:courseName" element={<CourseDescription />} />
            <Route path="/course-content/:courseName" element={<CourseContent />} />
            <Route path="/preferences" element={<UserPreferencesForm />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;