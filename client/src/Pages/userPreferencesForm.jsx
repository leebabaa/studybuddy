import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const interestsOptions = ["AI", "Machine Learning", "Math", "Python", "Java", "DSA"];
const subjectsOptions = ["Mathematics", "Physics", "Computer Science", "Statistics"];

const UserPreferencesForm = () => {
  const navigate = useNavigate();
  const [interests, setInterests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState(""); // Added for feedback
  const [loading, setLoading] = useState(false); // Added for loading state

  const handleCheckboxChange = (setState, value) => {
    setState((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userEmail = localStorage.getItem("userEmail");
    const token = localStorage.getItem("authToken");

    if (!userEmail || !token) {
      setMessage("User not found or not authenticated.");
      return;
    }

    const preferencesData = { email: userEmail, interests, subjects };

    setLoading(true);
    try {
      // Optionally save to API (uncomment and adjust endpoint if needed)
      /*
      const response = await fetch("http://localhost:5000/api/users/preferences/draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(preferencesData),
      });
      if (!response.ok) {
        const data = await response.json();
        setMessage(data.message || "Failed to save preferences.");
        setLoading(false);
        return;
      }
      */

      // Save to localStorage as a simple example
      localStorage.setItem("preferencesDraft", JSON.stringify(preferencesData));
      setMessage("Preferences saved successfully! You can continue editing or navigate to the dashboard.");
      // Note: No navigation here, form stays open
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Tell Us Your Interests</h2>
      {message && <p className="text-center mt-3">{message}</p>} {/* Simple text feedback */}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <h5>Select Your Interests:</h5>
          {interestsOptions.map((interest) => (
            <label key={interest} className="d-block">
              <input
                type="checkbox"
                value={interest}
                checked={interests.includes(interest)}
                onChange={() => handleCheckboxChange(setInterests, interest)}
                disabled={loading}
              />{" "}
              {interest}
            </label>
          ))}
        </div>

        <div className="mb-3">
          <h5>Select Subjects You Want to Study:</h5>
          {subjectsOptions.map((subject) => (
            <label key={subject} className="d-block">
              <input
                type="checkbox"
                value={subject}
                checked={subjects.includes(subject)}
                onChange={() => handleCheckboxChange(setSubjects, subject)}
                disabled={loading}
              />{" "}
              {subject}
            </label>
          ))}
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  );
};

export default UserPreferencesForm;