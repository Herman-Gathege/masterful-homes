import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaMagic, FaLeaf, FaRocket } from "react-icons/fa";

import Footer from "../components/Footer";

const Home = () => {
  return (
    <div
      className="home-page"
      style={{ fontFamily: "sans-serif", lineHeight: 1.6 }}
    >
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
          backgroundImage: "url('/src/assets/hero2.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // dark overlay
            zIndex: 1,
          }}
        ></div>

        {/* Hero Content */}
        <div style={{ zIndex: 2, maxWidth: "800px", padding: "2rem" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            Be the Master of YOUR Space
          </h1>
          <p style={{ fontSize: "1.25rem", marginBottom: "2rem" }}>
            Smart home automations, thoughtful renovations, and seamless
            technology integration — giving you comfort, control, and efficiency
            without complexity.
          </p>
          <Link to="/services">
            <button
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                backgroundColor: "#1b263b",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Explore Services
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "3rem", backgroundColor: "#ffffff" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>
          Smart Living, with or without Renovations
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            marginTop: "2rem",
          }}
        >
          <div
            style={{
              width: "300px",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            <FaHome
              size={40}
              color="#1b263b"
              style={{ marginBottom: "1rem" }}
            />
            <h3 style={{ color: "#1b263b" }}>Whole-home control</h3>
            <p>
              Lighting, climate, security, and entertainment that respond to
              your voice, touch, schedule, or presence.
            </p>
          </div>
          <div
            style={{
              width: "300px",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            <FaMagic
              size={40}
              color="#1b263b"
              style={{ marginBottom: "1rem" }}
            />
            <h3 style={{ color: "#1b263b" }}>Personalized scenes</h3>
            <p>
              Set lights, temperature, music, and shades to your mood with a
              single tap.
            </p>
          </div>
          <div
            style={{
              width: "300px",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            <FaLeaf
              size={40}
              color="#1b263b"
              style={{ marginBottom: "1rem" }}
            />
            <h3 style={{ color: "#1b263b" }}>Energy savings</h3>
            <p>
              Smart thermostats, occupancy sensors, and monitoring to cut waste
              without sacrificing comfort.
            </p>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section style={{ padding: "3rem", backgroundColor: "#f0f4f8" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>Packages</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            marginTop: "2rem",
          }}
        >
          <div
            style={{
              width: "300px",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            <FaRocket
              size={40}
              color="#1b263b"
              style={{ marginBottom: "1rem" }}
            />
            <h3>QuickStart Automation</h3>
            <p>
              Ideal for renters or no-reno projects. Core scenes, lighting,
              thermostat, and starter security.
            </p>
          </div>
          <div
            style={{
              width: "300px",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            <FaHome
              size={40}
              color="#1b263b"
              style={{ marginBottom: "1rem" }}
            />
            <h3>Home Mastery Core</h3>
            <p>
              Multi-room automation with lighting, shades, climate, audio, and
              family routines.
            </p>
          </div>
          <div
            style={{
              width: "300px",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            <FaMagic
              size={40}
              color="#1b263b"
              style={{ marginBottom: "1rem" }}
            />
            <h3>Total Transformation</h3>
            <p>
              Renovation + automation: design, clean wiring, premium finishes,
              and bespoke smart living throughout.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section style={{ padding: "3rem", backgroundColor: "#ffffff" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>How We Work</h2>
        <ol
          style={{ maxWidth: "800px", margin: "2rem auto", color: "#1b263b" }}
        >
          <li>
            <strong>Discovery:</strong> Walkthrough of your needs, routines, and
            style.
          </li>
          <li>
            <strong>Design:</strong> Clear plan with minimal upgrades to full
            remodel options.
          </li>
          <li>
            <strong>Build & Integrate:</strong> Clean installs, smooth system
            setup, meticulous finishes.
          </li>
          <li>
            <strong>Onboarding:</strong> We train you and your family until it’s
            second nature.
          </li>
          <li>
            <strong>Support:</strong> Continuous tweaks as your life evolves.
          </li>
        </ol>
      </section>

      {/* About Section */}
      <section style={{ padding: "3rem", backgroundColor: "#f5f7fa" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>About Us</h2>
        <p style={{ maxWidth: "800px", margin: "0 auto", color: "#1b263b" }}>
          We specialize in smart home automation and small-scale renovations
          that enhance comfort, convenience, and efficiency. By blending
          cutting-edge tech with timeless craftsmanship, we make your home work
          smarter for you.
        </p>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "3rem",
          textAlign: "center",
          backgroundColor: "#e6eef5",
        }}
      >
        <h2 style={{ color: "#1b263b" }}>Live Like the Master of Your Home</h2>
        <p style={{ margin: "1rem 0", color: "#1b263b" }}>
          Technology and design that serve you — so life feels easy, efficient,
          and pleasantly elevated.
        </p>
        <Link to="/contact-us">
          <button
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              backgroundColor: "#1b263b",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Contact Us Today
          </button>
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
