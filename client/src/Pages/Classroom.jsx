import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ChatPanel from "./ChatPanel"; // ✅ Import Chat Panel

const Classroom = () => {
  const navigate = useNavigate();

  const students = [
    { name: "Selam", image: "/images/selam.jpg" },
    { name: "Kelvin", image: "/images/kelvin.jpg" },
    { name: "Jedson", image: "/images/jedson.jpg" },
    { name: "Mashruk", image: "/images/mashruk.jpg" },
    { name: "Asha", image: "/images/asha.jpg" },
    { name: "Me", image: "/images/me.jpg", isMe: true }, // ✅ Added self indicator
  ];

  return (
    <div
      className="min-vh-100 text-white d-flex flex-column align-items-center"
      style={{
        background: "linear-gradient(to bottom, black, #003300)",
        paddingRight: "320px", // Space for chat panel
      }}
    >
      {/* Back Button */}
      <div
        className="d-flex align-items-center w-100 px-3"
        style={{
          position: "absolute",
          top: "80px",
          left: "10px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/yourbuddy")}
      >
        <ArrowLeft size={28} color="white" />
        <span className="ms-2 fs-4 fw-bold">Class Room</span>
      </div>

      {/* Student Grid */}
      <div className="container mt-5">
        <div className="row g-4 justify-content-center">
          {students.map((student, index) => (
            <div key={index} className="col-md-4 d-flex flex-column align-items-center">
              {/* Name on top of box */}
              <span className="fw-bold text-center mb-2">{student.name}</span>

              <div
                className="rounded shadow-lg overflow-hidden"
                style={{
                  width: "220px",
                  height: "170px",
                  backgroundColor: "#222",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "10px",
                }}
              >
                <img
                  src={student.image}
                  alt={student.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite and End Buttons Below Student Grid */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn fw-bold px-4 py-2 me-3"
          style={{
            backgroundColor: "limegreen",
            color: "black",
            borderRadius: "5px",
            transition: "background 0.3s ease-in-out",
          }}
        >
          Invite
        </button>
        <button
          className="btn fw-bold px-4 py-2"
          style={{
            backgroundColor: "red",
            color: "white",
            borderRadius: "5px",
            transition: "background 0.3s ease-in-out",
          }}
        >
          End
        </button>
      </div>

      {/* Chat Panel on the right */}
      <ChatPanel  userId="student_123"/>
    </div>
  );
};

export default Classroom;
