// src/components/UserRegistrationForm.jsx
import React, { useState } from "react";
import { registerUser } from "../services/authService";
import Modal from "./Modal";
import "../css/UserRegistrationForm.css";

function UserRegistrationForm({ onSuccess, showModal = true, handleCloseModal }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "technician", // default role
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(form);
      setMessage(res.message || "User registered successfully");

      // reset form after success
      setForm({ username: "", email: "", password: "", role: "technician" });

      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Modal isOpen={showModal} onClose={handleCloseModal}>
      <h3>Register User</h3>
      <form onSubmit={handleSubmit} className="registration-form">
        <input
          name="username"
          placeholder="Full Name"
          value={form.username}
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="form-input"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="form-input"
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="technician">Technician</option>
          <option value="finance">Finance</option>
        </select>
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="form-input"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="show-password-btn"
        >
          {showPassword ? "Hide" : "Show"} Password
        </button>

        <button type="submit" className="submit-btn">
          Register User
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </Modal>
  );
}

export default UserRegistrationForm;
