import React, { useState } from "react";
import { registerUser } from "../services/authService";
import Modal from "./Modal"; // 👈 Import our Modal
import "../css/UserRegistrationForm.css";

function UserRegistrationForm({ onSuccess, showLoginLink = false, showModal = true, handleCloseModal }) {
  const [form, setForm] = useState({
    username: "",
    school_id: "",
    email: "",
    parent_email: "",
    role: "technician",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(form);
      setMessage(res.message);
      setForm({ username: "", school_id: "", email: "", parent_email: "", role: "student", password: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Modal isOpen={showModal} onClose={handleCloseModal}>
      <h3>Register User</h3>
      <form onSubmit={handleSubmit} className="registration-form">
        <input
          name="username"
          placeholder="Full Name of (student or teacher)"
          value={form.username}
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          name="school_id"
          placeholder="School ID of (student or teacher)"
          value={form.school_id}
          onChange={handleChange}
          required
          className="form-input"
        />
        <select name="role" value={form.role} onChange={handleChange} className="form-input">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <input
          name="email"
          placeholder="User Email of (student or teacher)"
          value={form.email}
          onChange={handleChange}
          required
          className="form-input"
        />
        {form.role === "student" && (
          <input
            name="parent_email"
            placeholder="Parent Email of (student)"
            value={form.parent_email}
            onChange={handleChange}
            required
            className="form-input"
          />
        )}
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password (leave blank to use school ID)"
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
        <button type="submit" className="submit-btn">Register User</button>

        {showLoginLink && (
          <p className="login-link">
            Already have an account? <a href="/login">Login</a>
          </p>
        )}
        {message && <p className="message">{message}</p>}
      </form>
    </Modal>
  );
}

export default UserRegistrationForm;
