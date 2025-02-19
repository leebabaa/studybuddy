import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './Registration.css'
const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLogin, setIsLogin] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isLogin ? "Logging in:" : "Registering:", formData);
  };

  return (
    <div className="registration-form-container">
      <div className="registration-form">
        <h2 className="text-center mb-4">{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group mb-3">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          )}
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
          <button type="submit" className="btn btn-primary w-100 mb-3">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="text-center">
          <button className="btn btn-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Create an account" : "Already have an account? Log in"}
          </button>
          {isLogin && <button className="btn btn-link">Forgot Password?</button>}
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;