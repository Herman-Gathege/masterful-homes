// src/pages/Signup.jsx
import React, { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { registerUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import "../css/Auth.css"; // 👈 shared auth styles

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { access_token, refresh_token, user } = await registerUser(form);

      // auto-login after signup
      login(access_token, refresh_token, user);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Your Account</h2>
        {error && <p className="auth-message">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="auth-input"
            placeholder="Choose a username"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="auth-input"
            placeholder="Enter your email"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="auth-input"
            placeholder="Create a password"
          />
          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>

        <p className="auth-text">
          Already have an account? <NavLink to="/login">Login</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Signup;
