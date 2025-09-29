// src/pages/Services.jsx
import React from "react";
import {
  FaUsers,
  FaTasks,
  FaClock,
  FaShieldAlt,
  FaChartBar,
  FaCogs,
  FaHandsHelping,
} from "react-icons/fa";
import {
  MdDashboardCustomize,
  MdOutlineIntegrationInstructions,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const Services = () => {
  return (
    <div
      style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#ffffff" }}
    >
      {/* Hero */}
      <section
        style={{
          textAlign: "center",
          padding: "5rem 1rem",
          backgroundColor: "#f5f7fa",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: "3rem",
            fontWeight: "700",
            color: "#053f5c",
          }}
        >
          Our Services
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: "800px",
            margin: "1.5rem auto",
            fontSize: "1.2rem",
            color: "#053f5c",
          }}
        >
          DashWise unifies HR, tasks, time tracking, and compliance into one
          powerful platform — helping your business work smarter, faster, and
          more securely.
        </motion.p>
        <motion.img
          src="/src/assets/hero-image.jpeg"
          alt="Dashboard Preview"
          style={{
            maxWidth: "720px",
            width: "100%",
            marginTop: "2rem",
            borderRadius: "10px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </section>

      {/* Core Modules */}
      <section style={{ padding: "5rem 2rem" }}>
        <h2
          style={{
            textAlign: "center",
            color: "#053f5c",
            fontWeight: "700",
          }}
        >
          Core Modules for Smarter Management
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            marginTop: "3rem",
            maxWidth: "1200px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {[
            {
              icon: <FaUsers size={40} color="#053f5c" />,
              title: "HR Directory",
              desc: "Manage employees, roles, and onboarding from one dashboard.",
            },
            {
              icon: <FaTasks size={40} color="#053f5c" />,
              title: "Task Management",
              desc: "Assign, track, and complete tasks seamlessly across your team.",
            },
            {
              icon: <FaClock size={40} color="#053f5c" />,
              title: "Time & Attendance",
              desc: "Track hours, manage PTO, and generate payroll-ready reports.",
            },
            {
              icon: <FaShieldAlt size={40} color="#053f5c" />,
              title: "Compliance & Docs",
              desc: "Securely store documents with audit trails and reminders.",
            },
            {
              icon: <FaChartBar size={40} color="#053f5c" />,
              title: "Insights & KPIs",
              desc: "Visualize productivity and monitor performance in real-time.",
            },
            {
              icon: <MdDashboardCustomize size={40} color="#053f5c" />,
              title: "Customizable Dashboard",
              desc: "Enable only the modules you need and scale as you grow.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              style={{
                background: "#f9f9f9",
                padding: "2rem",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderTop: "4px solid #053f5c",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
              <h3 style={{ color: "#053f5c", fontWeight: "600" }}>
                {item.title}
              </h3>
              <p style={{ color: "#053f5c" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Workflows Section */}
      <section style={{ padding: "5rem 2rem", backgroundColor: "#e6eef5" }}>
        <h2
          style={{ textAlign: "center", color: "#053f5c", fontWeight: "700" }}
        >
          Workflows That Simplify Your Day
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2rem",
            marginTop: "3rem",
          }}
        >
          {[
            {
              icon: (
                <MdOutlineIntegrationInstructions size={40} color="#053f5c" />
              ),
              title: "Onboarding Flow",
              desc: "Add employees, assign docs, and track progress automatically.",
            },
            {
              icon: <FaCogs size={40} color="#053f5c" />,
              title: "Automated Processes",
              desc: "Cut manual work with recurring workflows that just work.",
            },
            {
              icon: <FaHandsHelping size={40} color="#053f5c" />,
              title: "Team Collaboration",
              desc: "Unify communication, tasks, and goals in one platform.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              style={{
                width: "300px",
                textAlign: "center",
                background: "#fff",
                padding: "2rem",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderTop: "4px solid #053f5c",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
              <h3 style={{ color: "#053f5c", fontWeight: "600" }}>
                {item.title}
              </h3>
              <p style={{ color: "#053f5c" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Plans/Packages */}
      <section style={{ padding: "5rem 2rem" }}>
        <h2
          style={{ textAlign: "center", color: "#053f5c", fontWeight: "700" }}
        >
          Plans for Every Team
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2rem",
            marginTop: "3rem",
          }}
        >
          {[
            {
              icon: <FaUsers size={40} color="#053f5c" />,
              title: "Starter Plan",
              desc: "Perfect for small teams. Includes HR directory, tasks, and attendance.",
            },
            {
              icon: <FaChartBar size={40} color="#053f5c" />,
              title: "Growth Plan",
              desc: "Adds insights, compliance tools, and advanced workflows.",
            },
            {
              icon: <FaShieldAlt size={40} color="#053f5c" />,
              title: "Enterprise Plan",
              desc: "All modules unlocked with custom integrations and premium support.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              style={{
                width: "300px",
                textAlign: "center",
                background: "#f9f9f9",
                padding: "2rem",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderTop: "4px solid #053f5c",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
              <h3 style={{ color: "#053f5c", fontWeight: "600" }}>
                {item.title}
              </h3>
              <p style={{ color: "#053f5c" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "5rem 2rem",
          backgroundColor: "#f5f7fa",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ color: "#053f5c", fontWeight: "700" }}
        >
          Work Smarter with DashWise
        </motion.h2>
        <p
          style={{
            maxWidth: "800px",
            margin: "1.5rem auto",
            fontSize: "1.2rem",
            color: "#053f5c",
          }}
        >
          From startups to enterprises, DashWise adapts to your needs. Simplify
          management, cut manual work, and unlock real-time insights.
        </p>
        <Link to="/signup">
          <button
            style={{
              padding: "0.9rem 1.8rem",
              fontSize: "1rem",
              backgroundColor: "#f4d03f",
              color: "#053f5c",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Get Started
          </button>
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
