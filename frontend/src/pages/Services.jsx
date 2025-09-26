// Services.jsx (DashWise Revamp with animations & visuals)
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
    <div style={{ fontFamily: "sans-serif", backgroundColor: "#ffffff" }}>
      {/* Hero */}
      <section
        style={{
          padding: "4rem 2rem",
          textAlign: "center",
          backgroundColor: "#f5f7fa",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontSize: "3rem", color: "#1b263b" }}
        >
          Our Services
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: "800px",
            margin: "1rem auto",
            fontSize: "1.2rem",
            color: "#1b263b",
          }}
        >
          DashWise unifies HR, tasks, time tracking, and compliance into one
          powerful platform — helping your business work smarter, faster, and
          more securely.
        </motion.p>
        <motion.img
          src="/assets/services-hero-placeholder.png"
          alt="Dashboard Preview"
          style={{ maxWidth: "700px", width: "100%", marginTop: "2rem", borderRadius: "8px" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </section>

      {/* Core Modules */}
      <section style={{ padding: "3rem 2rem" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>
          Core Modules for Smarter Management
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            marginTop: "2rem",
            maxWidth: "1000px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {[
            {
              icon: <FaUsers size={40} color="#1b263b" />,
              title: "HR Directory",
              desc: "Manage employees, roles, and onboarding from one dashboard.",
            },
            {
              icon: <FaTasks size={40} color="#1b263b" />,
              title: "Task Management",
              desc: "Assign, track, and complete tasks seamlessly across your team.",
            },
            {
              icon: <FaClock size={40} color="#1b263b" />,
              title: "Time & Attendance",
              desc: "Track hours, manage PTO, and generate payroll-ready reports.",
            },
            {
              icon: <FaShieldAlt size={40} color="#1b263b" />,
              title: "Compliance & Docs",
              desc: "Securely store documents with audit trails and reminders.",
            },
            {
              icon: <FaChartBar size={40} color="#1b263b" />,
              title: "Insights & KPIs",
              desc: "Visualize productivity and monitor performance in real-time.",
            },
            {
              icon: <MdDashboardCustomize size={40} color="#1b263b" />,
              title: "Customizable Dashboard",
              desc: "Enable only the modules you need and scale as you grow.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              style={{
                backgroundColor: "#f9f9f9",
                padding: "1.5rem",
                borderRadius: "10px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
              <h3 style={{ color: "#1b263b" }}>{item.title}</h3>
              <p style={{ color: "#1b263b" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Workflows Section */}
      <section style={{ padding: "3rem 2rem", backgroundColor: "#f0f4f8" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>
          Workflows That Simplify Your Day
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2rem",
            marginTop: "2rem",
          }}
        >
          {[
            {
              icon: (
                <MdOutlineIntegrationInstructions size={40} color="#1b263b" />
              ),
              title: "Onboarding Flow",
              desc: "Add employees, assign docs, and track progress automatically.",
            },
            {
              icon: <FaCogs size={40} color="#1b263b" />,
              title: "Automated Processes",
              desc: "Cut manual work with recurring workflows that just work.",
            },
            {
              icon: <FaHandsHelping size={40} color="#1b263b" />,
              title: "Team Collaboration",
              desc: "Unify communication, tasks, and goals in one platform.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              style={{
                flex: "1 1 250px",
                maxWidth: "300px",
                textAlign: "center",
                background: "#fff",
                padding: "2rem",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
              <h3 style={{ color: "#1b263b" }}>{item.title}</h3>
              <p style={{ color: "#1b263b" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Plans/Packages */}
      <section style={{ padding: "3rem 2rem" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>
          Plans for Every Team
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2rem",
            marginTop: "2rem",
          }}
        >
          {[
            {
              icon: <FaUsers size={40} color="#1b263b" />,
              title: "Starter Plan",
              desc: "Perfect for small teams. Includes HR directory, tasks, and attendance.",
            },
            {
              icon: <FaChartBar size={40} color="#1b263b" />,
              title: "Growth Plan",
              desc: "Adds insights, compliance tools, and advanced workflows.",
            },
            {
              icon: <FaShieldAlt size={40} color="#1b263b" />,
              title: "Enterprise Plan",
              desc: "All modules unlocked with custom integrations and premium support.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              style={{
                flex: "1 1 250px",
                maxWidth: "300px",
                textAlign: "center",
                background: "#f9f9f9",
                padding: "2rem",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
              <h3 style={{ color: "#1b263b" }}>{item.title}</h3>
              <p style={{ color: "#1b263b" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          backgroundColor: "#f5f7fa",
        }}
      >
        <h2 style={{ color: "#1b263b" }}>Work Smarter with DashWise</h2>
        <p
          style={{
            maxWidth: "800px",
            margin: "1rem auto",
            fontSize: "1.2rem",
            color: "#1b263b",
          }}
        >
          From startups to enterprises, DashWise adapts to your needs. Simplify
          management, cut manual work, and unlock real-time insights.
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
              marginTop: "1rem",
            }}
          >
            Get Started Free
          </button>
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
