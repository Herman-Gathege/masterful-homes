// AboutUs.jsx (DashWise Revamp with animations & visuals)
import React from "react";
import Footer from "../components/Footer";
import {
  FaLightbulb,
  FaUsers,
  FaHandsHelping,
  FaCogs,
  FaUserCheck,
} from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div style={{ backgroundColor: "#ffffff", fontFamily: "sans-serif" }}>
      {/* Intro Section */}
      <section style={{ textAlign: "center", padding: "3rem 1rem" }}>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ color: "#1b263b", fontSize: "3rem" }}
        >
          Smarter Work. Simpler Management.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: "800px",
            margin: "1rem auto",
            color: "#1b263b",
            fontSize: "1.2rem",
          }}
        >
          At <strong>DashWise</strong>, we believe businesses should run smoothly,
          not stressfully. We bring together HR, tasks, time tracking, and
          compliance into one smart dashboard so teams can focus on growth —
          not juggling tools.
        </motion.p>
        <motion.img
          src="/assets/about-placeholder.png"
          alt="Team collaboration"
          style={{ maxWidth: "600px", width: "100%", marginTop: "2rem", borderRadius: "8px" }}
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
          gap: "3rem",
          justifyContent: "center",
          margin: "4rem 0",
        }}
      >
        {[
          {
            icon: <FaLightbulb size={40} color="#1b263b" />,
            title: "Our Mission",
            desc: "To empower organizations of all sizes with accessible, centralized, and efficient tools that simplify daily operations.",
          },
          {
            icon: <FaUsers size={40} color="#1b263b" />,
            title: "Our Vision",
            desc: "A future where every business has the clarity and confidence to grow with one powerful dashboard.",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            style={{
              flex: "1",
              maxWidth: "400px",
              textAlign: "center",
              background: "#f9f9f9",
              padding: "2rem",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
            <h2 style={{ color: "#1b263b" }}>{item.title}</h2>
            <p style={{ color: "#1b263b" }}>{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Story Section */}
      <section
        style={{
          backgroundColor: "#f0f4f8",
          padding: "4rem 2rem",
          textAlign: "center",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ color: "#1b263b" }}
        >
          Our Story
        </motion.h2>
        <p
          style={{
            maxWidth: "900px",
            margin: "2rem auto",
            color: "#1b263b",
            fontSize: "1.1rem",
            lineHeight: "1.8",
          }}
        >
          We built DashWise after seeing the challenges businesses face when
          managing scattered tools. Too often, managers struggle with inefficiency,
          employees feel disconnected, and important insights get lost.
        </p>
        <motion.img
          src="/assets/story-placeholder.png"
          alt="Business workflow"
          style={{ maxWidth: "700px", width: "100%", borderRadius: "8px" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: "4rem 2rem" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>
          Why Choose DashWise?
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            marginTop: "3rem",
          }}
        >
          {[
            {
              icon: <FaCogs size={40} color="#1b263b" />,
              title: "All-in-One Efficiency",
              desc: "Replace multiple apps with one dashboard.",
            },
            {
              icon: <MdDashboardCustomize size={40} color="#1b263b" />,
              title: "Customizable Modules",
              desc: "Enable only what you need. DashWise grows with you.",
            },
            {
              icon: <FaHandsHelping size={40} color="#1b263b" />,
              title: "Dedicated Support",
              desc: "From onboarding to scaling — we’ve got you covered.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              style={{
                width: "300px",
                marginBottom: "2rem",
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
      <section style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ color: "#1b263b" }}
        >
          Ready to Work Smarter?
        </motion.h2>
        <p
          style={{
            maxWidth: "800px",
            margin: "2rem auto",
            fontSize: "1.2rem",
            color: "#1b263b",
          }}
        >
          Whether you’re a small team or a growing enterprise, DashWise gives
          you the clarity and control you need. Join us today.
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
