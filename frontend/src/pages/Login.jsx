// Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

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
      const { access_token, refresh_token, role } = await loginUser(
        credentials
      );
      login(access_token, refresh_token, role);

      // redirect based on role
      if (role === "admin") navigate("/dashboard/admin");
      else if (role === "manager") navigate("/dashboard/manager");
      else if (role === "finance") navigate("/dashboard/finance");
      else navigate("/dashboard/technician");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Welcome Back</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter(work email)"
            />
          
         
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter Your Password"
            />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        <p style={styles.text}>
          Don't have an account? <a href="/signup">Sign Up</a>
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
  message: {
    color: "red",
    textAlign: "center",
    marginTop: "1rem",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.9rem",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    color: "#333",
  },
  checkbox: {
    accentColor: "#1b263b",
  },
  forgotLink: {
    color: "#1b263b",
    textDecoration: "none",
  },
};

export default Login;
