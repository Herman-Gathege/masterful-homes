// src/pages/AboutUs.jsx
import React from "react";
import Footer from "../components/Footer";
import {
  FaLightbulb,
  FaUsers,
  FaHandsHelping,
  FaCogs,
} from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div style={{ backgroundColor: "#ffffff", fontFamily: "Inter, sans-serif" }}>
      {/* Intro Section */}
      <section style={{ textAlign: "center", padding: "5rem 1rem" }}>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            color: "#053f5c",
            fontSize: "3rem",
            fontWeight: "700",
          }}
        >
          Smarter Work. Simpler Management.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: "800px",
            margin: "1.5rem auto",
            color: "#053f5c",
            fontSize: "1.2rem",
          }}
        >
          At <strong>DashWise</strong>, we believe businesses should run smoothly,
          not stressfully. We centralize HR, tasks, time tracking, and compliance
          into one smart dashboard so teams can focus on growth — not juggling tools.
        </motion.p>
        <motion.img
          src="/src/assets/about-placeholder.png"
          alt="Team collaboration"
          style={{
            maxWidth: "650px",
            width: "100%",
            marginTop: "2rem",
            borderRadius: "10px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </section>

      {/* Mission + Vision */}
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
          margin: "4rem 0",
          padding: "0 2rem",
        }}
      >
        {[
          {
            icon: <FaLightbulb size={40} color="#053f5c" />,
            title: "Our Mission",
            desc: "Empowering organizations with centralized, efficient tools that simplify operations.",
          },
          {
            icon: <FaUsers size={40} color="#053f5c" />,
            title: "Our Vision",
            desc: "A future where businesses grow confidently with clarity and smart dashboards.",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            style={{
              flex: "1",
              maxWidth: "420px",
              textAlign: "center",
              background: "#f9f9f9",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              borderTop: "4px solid #053f5c",
            }}
          >
            <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
            <h2 style={{ color: "#053f5c", fontWeight: "600" }}>{item.title}</h2>
            <p style={{ color: "#053f5c" }}>{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Story Section */}
      <section
        style={{
          backgroundColor: "#f5f7fa",
          padding: "5rem 2rem",
          textAlign: "center",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ color: "#053f5c", fontWeight: "700" }}
        >
          Our Story
        </motion.h2>
        <p
          style={{
            maxWidth: "900px",
            margin: "2rem auto",
            color: "#053f5c",
            fontSize: "1.1rem",
            lineHeight: "1.8",
          }}
        >
          We built DashWise after seeing how scattered tools slow down businesses.
          Too often, managers deal with inefficiency, employees feel disconnected,
          and critical insights get buried. DashWise is the clarity layer businesses
          have been missing.
        </p>
        <motion.img
          src="/src/assets/story-placeholder.png"
          alt="Business workflow"
          style={{
            maxWidth: "720px",
            width: "100%",
            borderRadius: "10px",
            marginTop: "1.5rem",
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: "5rem 2rem" }}>
        <h2 style={{ textAlign: "center", color: "#053f5c", fontWeight: "700" }}>
          Why Choose DashWise?
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
              icon: <FaCogs size={40} color="#053f5c" />,
              title: "All-in-One Efficiency",
              desc: "Say goodbye to scattered apps — everything lives in one dashboard.",
            },
            {
              icon: <MdDashboardCustomize size={40} color="#053f5c" />,
              title: "Customizable Modules",
              desc: "Pick only what you need. DashWise adapts as your business grows.",
            },
            {
              icon: <FaHandsHelping size={40} color="#053f5c" />,
              title: "Dedicated Support",
              desc: "From onboarding to scaling — our team is with you every step.",
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
              <h3 style={{ color: "#053f5c", fontWeight: "600" }}>{item.title}</h3>
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
          backgroundColor: "#e6eef5",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ color: "#053f5c", fontWeight: "700" }}
        >
          Ready to Work Smarter?
        </motion.h2>
        <p
          style={{
            maxWidth: "800px",
            margin: "1.5rem auto",
            fontSize: "1.2rem",
            color: "#053f5c",
          }}
        >
          Whether you’re a small team or a growing enterprise, DashWise gives
          you the clarity and control you need. Join us today.
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
              transition: "background 0.3s ease",
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

export default AboutUs;
