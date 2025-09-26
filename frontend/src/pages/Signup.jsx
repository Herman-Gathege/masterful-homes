// Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "technician", // default role
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await registerUser(form);
      setSuccess("Account created! Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Create Your Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Choose a username"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter your email"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Create a password"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="technician">Technician</option>
            <option value="manager">Manager</option>
            <option value="finance">Finance</option>
          </select>
          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>
        <p style={styles.text}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "10vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
    padding: "2rem",
    marginTop: "10rem",
  },
  formCard: {
    backgroundColor: "#ffffff",
    padding: "3rem",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "450px",
  },
  title: {
    textAlign: "center",
    marginBottom: "2rem",
    color: "#1b263b",
    fontSize: "2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  input: {
    padding: "0.8rem",
    fontSize: "0.9rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "0.2s",
  },
  select: {
    padding: "0.8rem",
    fontSize: "0.9rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    background: "#fff",
    cursor: "pointer",
  },
  button: {
    padding: "0.9rem",
    fontSize: "1rem",
    backgroundColor: "#1b263b",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "1rem",
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: "1rem",
  },
};

export default Signup;
