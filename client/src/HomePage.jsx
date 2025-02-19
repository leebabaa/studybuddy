import React, { useState } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure JS is loaded

const HomePage =() => 
  {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div 
    className="min-vh-100 d-flex flex-column align-items-center justify-content-center" 
    style={{
      background: 'linear-gradient(to bottom, black 20%, #004d40 50%, #002147 80%)',
      color: 'white',
    }}
  >
  
      <div className="text-center text-white py-4">
        <h1 className="display-4 fw-bold mt-5">Study Smarter, Not Harder</h1>
      </div>

      {/* Cards Section */}
      <div className="container d-flex flex-column align-items-center">
        <div className="row g-4 w-50 mx-auto text-center">
          {[1, 2, 3, 4].map((num) => (
            <div className="col-md-6" key={num}>
              <button 
                className="card p-4 border-0 shadow-lg w-100 bg-transparent"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)', 
                  backdropFilter: 'blur(10px)', 
                  borderRadius: '15px', 
                  color: 'white',
                }}
              >
                <div className="card-body">
                  <h5 className="card-title">Card {num}</h5>
                  <p className="card-text">Supporting text for Card {num}.</p>
                  <a href="#" className="btn btn-primary">Enroll</a>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Courses */}
      <div className="text-center text-white py-4">
        <h1 className="display-4 fw-bold">Trending Courses</h1>
      </div>
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="row g-4 w-75">
            {[1, 2, 3].map((num) => (
              <div className="col-md-4" key={num}>
                <div 
                  className="card border-0 shadow-lg bg-transparent"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '15px',
                    color: 'white',
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Card {num}</h5>
                    <p className="card-text">Supporting text for Card {num}.</p>
                    <a href="#" className="btn btn-primary">Enroll</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join Study Groups */}
      <div className="text-center text-white py-4">
        <h1 className="display-4 fw-bold">Join Study Groups</h1>
      </div>
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="row g-4 w-75">
            {[1, 2, 3].map((num) => (
              <div className="col-md-4" key={num}>
                <div 
                  className="card border-0 shadow-lg bg-transparent"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '15px',
                    color: 'white',
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Card {num}</h5>
                    <p className="card-text">Supporting text for Card {num}.</p>
                    <a href="#" className="btn btn-primary">Enroll</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
