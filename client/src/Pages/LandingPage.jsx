import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import Navbar from "./components/Navbar";
import "./landing.css";
import RegistrationForm from "../Pages/RegistrationForm";

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselItems = [
    {
      image: "https://images.pexels.com/photos/8199602/pexels-photo-8199602.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Study Groups",
      description: "Collaborate with peers for better learning.",
    },
    {
      image: "https://images.pexels.com/photos/5632406/pexels-photo-5632406.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Online Resources",
      description: "Access a vast library of study materials.",
    },
    {
      image: "https://images.pexels.com/photos/7887844/pexels-photo-7887844.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Progress Tracking",
      description: "Monitor your progress and stay motivated.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  return (
    <div className="min-vh-100 gradient-bg ">
      {/* <Navbar /> */}

      {/* Hero Section */}
      <div className="container  text-white ">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="display-4 mb-4">Welcome to Study Buddy</h1>
            <p className="lead mb-4">
              Your ultimate companion for productive studying. Join thousands of students who are achieving their goals with Study Buddy.
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => setIsModalOpen(true)}>Get Started</button>
          </div>

          {/* Image Carousel */}
          <div className="col-md-6">
            <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                {carouselItems.map((item, index) => (
                  <div key={index} className={`carousel-item ${index === activeIndex ? "active" : ""}`}>
                    <img src={item.image} className="d-block w-100 rounded" alt={item.title} />
                    <div className="carousel-caption d-none d-md-block">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            <RegistrationForm />
          </div>
        </div>
      )}

      {/* CSS for Modal */}
      <style>
        {`
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
            background: gray;
            padding: 20px;
            border-radius: 10px;
            max-width: 400px;
            width: 100%;
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
        `}
      </style>
    </div>
  );
};

export default LandingPage;
