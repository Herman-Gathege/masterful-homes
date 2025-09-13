// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { registerUser } from "../services/authService";

// function Signup() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     username: "",
//     school_id: "",
//     email: "",
//     parent_email: "",
//     role: "student",
//     password: "",
//   });

//   const [message, setMessage] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await registerUser(form);
//       setMessage(res.message);
//       navigate("/login");
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Signup failed");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.formCard}>
//         <h2 style={styles.title}>Admin: Register a New User</h2>
//         <form onSubmit={handleSubmit} style={styles.form}>
//           <input
//             name="username"
//             placeholder="Full Name"
//             onChange={handleChange}
//             value={form.username}
//             required
//             style={styles.input}
//           />
//           <input
//             name="school_id"
//             placeholder="School ID"
//             onChange={handleChange}
//             value={form.school_id}
//             required
//             style={styles.input}
//           />
//           <select
//             name="role"
//             onChange={handleChange}
//             value={form.role}
//             style={styles.input}
//           >
//             <option value="student">Student</option>
//             <option value="teacher">Teacher</option>
//           </select>
//           <input
//             name="email"
//             placeholder="User Email"
//             onChange={handleChange}
//             value={form.email}
//             required
//             style={styles.input}
//           />
//           {form.role === "student" && (
//             <input
//               name="parent_email"
//               placeholder="Parent Email"
//               onChange={handleChange}
//               value={form.parent_email}
//               required
//               style={styles.input}
//             />
//           )}
//           <input
//             name="password"
//             type={showPassword ? "text" : "password"}
//             placeholder="Password (leave empty to default to School ID)"
//             onChange={handleChange}
//             value={form.password}
//             style={styles.input}
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             style={{
//               ...styles.button,
//               backgroundColor: "#ccc",
//               color: "#1b263b",
//               marginTop: "-10px",
//               marginBottom: "1rem",
//             }}
//           >
//             {showPassword ? "Hide" : "Show"} Password
//           </button>

//           <button type="submit" style={styles.button}>
//             Register
//           </button>
//           <p style={{ textAlign: "center" }}>
//             Already have an account?{" "}
//             <a
//               href="/login"
//               style={{
//                 color: "#1b263b",
//                 textDecoration: "underline",
//                 fontWeight: "500",
//               }}
//             >
//               Login
//             </a>
//           </p>
//         </form>
//         {message && <p style={styles.message}>{message}</p>}
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     minHeight: "100vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#f3f7f7",
//     padding: "2rem",
//   },
//   formCard: {
//     backgroundColor: "#ffffff",
//     padding: "3rem",
//     borderRadius: "12px",
//     boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
//     width: "100%",
//     maxWidth: "500px",
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: "2rem",
//     color: "#1b263b",
//     fontSize: "2rem",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "1.2rem",
//   },
//   input: {
//     padding: "0.8rem",
//     fontSize: "1rem",
//     borderRadius: "8px",
//     border: "1px solid #ccc",
//     outline: "none",
//   },
//   button: {
//     padding: "0.9rem",
//     fontSize: "1rem",
//     backgroundColor: "#1b263b",
//     color: "#fff",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//   },
//   message: {
//     marginTop: "1rem",
//     textAlign: "center",
//     color: "green",
//   },
// };

// export default Signup;

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
    <div style={{ padding: "2rem" }}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Role (optional)</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="technician">Technician</option>
            <option value="manager">Manager</option>
            <option value="finance">Finance</option>
          </select>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
