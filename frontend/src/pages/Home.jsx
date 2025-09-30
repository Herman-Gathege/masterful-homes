// frontend/src/pages/Home.jsx
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
import "../css/Home.css";

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="overlay" />
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Be in Control of Your Business</h1>
          <p>
            DashWise centralizes HR, tasks, time tracking, and compliance into
            one smart dashboard so you can focus on growth, not chaos.
          </p>
          <Link to="/signup">
            <button className="cta-btn">Get Started Free</button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose DashWise?</h2>
        <div className="feature-grid">
          {[
            {
              icon: <FaUsers />,
              title: "HR Directory",
              desc: "Manage employees, roles, and onboarding — all from one place.",
            },
            {
              icon: <FaTasks />,
              title: "Task Management",
              desc: "Assign, track, and complete tasks efficiently with zero confusion.",
            },
            {
              icon: <FaClock />,
              title: "Time & Attendance",
              desc: "Clock in/out, manage timesheets, and prepare payroll effortlessly.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
            >
              <div className="icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modules Section */}
      <section className="modules">
        <h2>DashWise Modules</h2>
        <div className="module-grid">
          {[
            {
              icon: <FaShieldAlt />,
              title: "Compliance & Docs",
              desc: "Securely store documents, automate audit trails, and stay compliant.",
            },
            {
              icon: <FaChartBar />,
              title: "Insights & KPIs",
              desc: "Monitor performance, track training, and visualize business metrics.",
            },
            {
              icon: <FaTasks />,
              title: "Workflows",
              desc: "Automate repetitive processes to save time and reduce errors.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="module-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
            >
              <div className="icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="process">
        <h2>How DashWise Works</h2>
        <ol>
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
      <section className="about">
        <h2>About DashWise</h2>
        <p>
          DashWise is built to simplify business management. From HR and
          attendance to compliance and insights, we give you a single platform
          to run operations smoothly and efficiently. Our mission: help
          businesses save time, cut chaos, and grow confidently.
        </p>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Run Your Business the Smart Way</h2>
        <p>
          Join thousands of teams already simplifying their work with DashWise.
        </p>
        <Link to="/signup">
          <button className="cta-btn">Get Started Today</button>
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
