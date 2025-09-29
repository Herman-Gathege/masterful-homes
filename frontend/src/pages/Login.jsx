// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import "../css/Auth.css"; // 👈 new shared auth styles

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { access_token, refresh_token, user } = await loginUser(credentials);
      login(access_token, refresh_token, user);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        {error && <p className="auth-message">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            className="auth-input"
            placeholder="Enter work email"
          />

          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="auth-input"
            placeholder="Enter your password"
          />

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        <p className="auth-text">
          Don’t have an account? <NavLink to="/signup">Sign Up</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
