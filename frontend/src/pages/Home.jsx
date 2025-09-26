// frontend/src/pages/Home.jsx (Revamped DashWise Home)

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaTasks,
  FaClock,
  FaShieldAlt,
  FaChartBar,
} from "react-icons/fa";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div style={{ fontFamily: "sans-serif", lineHeight: 1.6 }}>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          height: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
          marginTop: "70px",
          backgroundImage: "url('/src/assets/hero-image.jpeg')", // 🔄 update image
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        />

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ zIndex: 2, maxWidth: "800px", padding: "2rem" }}
        >
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            Be in Control of Your Business
          </h1>
          <p style={{ fontSize: "1.25rem", marginBottom: "2rem" }}>
            DashWise centralizes HR, tasks, time tracking, and compliance into
            one smart dashboard so you can focus on growth, not chaos.
          </p>
          <Link to="/signup">
            <button
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                backgroundColor: "#f4d03f",
                color: "#1b263b",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Get Started Free
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "4rem 2rem", backgroundColor: "#ffffff" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>
          Why Choose DashWise?
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            marginTop: "2rem",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {[
            {
              icon: <FaUsers size={40} color="#1b263b" />,
              title: "HR Directory",
              desc: "Manage employees, roles, and onboarding — all from one place.",
            },
            {
              icon: <FaTasks size={40} color="#1b263b" />,
              title: "Task Management",
              desc: "Assign, track, and complete tasks efficiently with zero confusion.",
            },
            {
              icon: <FaClock size={40} color="#1b263b" />,
              title: "Time & Attendance",
              desc: "Clock in/out, manage timesheets, and prepare payroll effortlessly.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              style={{
                backgroundColor: "#f9f9f9",
                padding: "1.5rem",
                borderRadius: "10px",
                textAlign: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
              <h3 style={{ color: "#1b263b" }}>{item.title}</h3>
              <p style={{ color: "#1b263b" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modules Section */}
      <section style={{ padding: "4rem 2rem", backgroundColor: "#f0f4f8" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>
          DashWise Modules
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            marginTop: "2rem",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {[
            {
              icon: <FaShieldAlt size={40} color="#1b263b" />,
              title: "Compliance & Docs",
              desc: "Securely store documents, automate audit trails, and stay compliant.",
            },
            {
              icon: <FaChartBar size={40} color="#1b263b" />,
              title: "Insights & KPIs",
              desc: "Monitor performance, track training, and visualize business metrics.",
            },
            {
              icon: <FaTasks size={40} color="#1b263b" />,
              title: "Workflows",
              desc: "Automate repetitive processes to save time and reduce errors.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#fff",
                padding: "1.5rem",
                borderRadius: "10px",
                textAlign: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
              <h3 style={{ color: "#1b263b" }}>{item.title}</h3>
              <p style={{ color: "#1b263b" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section style={{ padding: "4rem 2rem", backgroundColor: "#ffffff" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>
          How DashWise Works
        </h2>
        <ol
          style={{
            maxWidth: "800px",
            margin: "2rem auto",
            color: "#1b263b",
            fontSize: "1.1rem",
            lineHeight: "1.8",
          }}
        >
          <li>
            <strong>Sign Up:</strong> Create your account and set up your
            organization.
          </li>
          <li>
            <strong>Add Employees:</strong> Invite your team and assign roles.
          </li>
          <li>
            <strong>Track & Manage:</strong> Handle attendance, tasks, and
            documents in real time.
          </li>
          <li>
            <strong>Get Insights:</strong> Access KPIs and reports instantly.
          </li>
          <li>
            <strong>Scale with Ease:</strong> Customize modules as your business
            grows.
          </li>
        </ol>
      </section>

      {/* About Section */}
      <section style={{ padding: "4rem 2rem", backgroundColor: "#f5f7fa" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>About DashWise</h2>
        <p
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            color: "#1b263b",
            fontSize: "1.1rem",
          }}
        >
          DashWise is built to simplify business management. From HR and
          attendance to compliance and insights, we give you a single platform
          to run operations smoothly and efficiently. Our mission: help
          businesses save time, cut chaos, and grow confidently.
        </p>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "4rem 2rem",
          textAlign: "center",
          backgroundColor: "#e6eef5",
        }}
      >
        <h2 style={{ color: "#1b263b" }}>Run Your Business the Smart Way</h2>
        <p
          style={{
            margin: "1rem 0",
            color: "#1b263b",
            fontSize: "1.2rem",
          }}
        >
          Join thousands of teams already simplifying their work with DashWise.
        </p>
        <Link to="/signup">
          <button
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              backgroundColor: "#f4d03f",
              color: "#1b263b",
              border: "none",
              borderRadius: "5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Get Started Today
          </button>
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
