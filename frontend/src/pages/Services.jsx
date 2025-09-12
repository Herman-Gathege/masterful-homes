import React from "react";
import {
  FaCogs,
  FaBolt,
  FaLock,
  FaLeaf,
  FaUsers,
  FaPaintRoller,
  FaLightbulb,
  FaMobileAlt,
  FaHandsHelping,
} from "react-icons/fa";
import {
  MdOutlineDesignServices,
  MdOutlineHomeRepairService,
} from "react-icons/md";
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
        <h1 style={{ fontSize: "3rem", color: "#1b263b" }}>Our Services</h1>
        <p
          style={{
            maxWidth: "800px",
            margin: "1rem auto",
            fontSize: "1.2rem",
            color: "#1b263b",
          }}
        >
          Smart home automations, thoughtful renovations, and customizable
          packages — helping you live in a home that adapts to you.
        </p>
      </section>

      {/* Core Services */}
      <section style={{ padding: "3rem 2rem" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>
          Smart Living, with or without Renovations
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
              icon: <FaCogs size={40} color="#1b263b" />,
              title: "Whole-home Control",
              desc: "Lighting, climate, security, and entertainment that respond to your voice, touch, schedule, or presence.",
            },
            {
              icon: <MdOutlineDesignServices size={40} color="#1b263b" />,
              title: "Personalized Scenes",
              desc: "Modes like Work, Entertain, or Zen set lights, music, and temperature to match your lifestyle in a single tap.",
            },
            {
              icon: <FaUsers size={40} color="#1b263b" />,
              title: "Multi-user Friendly",
              desc: "Profiles for partners, kids, roommates, and guests — simple, secure, and intuitive.",
            },
            {
              icon: <FaLeaf size={40} color="#1b263b" />,
              title: "Energy Savings",
              desc: "Smart thermostats, occupancy sensors, and schedules that cut waste without sacrificing comfort.",
            },
            {
              icon: <FaLock size={40} color="#1b263b" />,
              title: "Security & Peace of Mind",
              desc: "Smart locks, cameras, and presence simulation that protect your home when you’re away.",
            },
            {
              icon: <FaBolt size={40} color="#1b263b" />,
              title: "Performance Upgrades",
              desc: "Soundproofing, insulation, and layout tweaks for comfort and efficiency.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
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
            </div>
          ))}
        </div>
      </section>

      {/* Lifestyle Modes */}
      <section style={{ padding: "3rem 2rem", backgroundColor: "#f0f4f8" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>
          Work Better, Unwind Faster, Entertain Easier
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
              icon: <FaMobileAlt size={40} color="#1b263b" />,
              title: "Work Mode",
              desc: "Task lighting, glare-free shades, quiet fans, and rock-solid Wi-Fi for productivity in one tap.",
            },
            {
              icon: <FaLightbulb size={40} color="#1b263b" />,
              title: "Entertain Mode",
              desc: "Whole-home audio, ambient lighting, and custom scenes to delight your guests.",
            },
            {
              icon: <FaLeaf size={40} color="#1b263b" />,
              title: "Zen Mode",
              desc: "Circadian lighting, clutter-free design, and soothing temperature routines for relaxation.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                flex: "1 1 250px",
                maxWidth: "300px",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
              <h3 style={{ color: "#1b263b" }}>{item.title}</h3>
              <p style={{ color: "#1b263b" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section style={{ padding: "3rem 2rem" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>
          Packages (Customizable)
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
              icon: <FaBolt size={40} color="#1b263b" />,
              title: "QuickStart Automation",
              desc: "Ideal for renters or no-reno projects. Includes core scenes, lighting, thermostat setup, and starter security.",
            },
            {
              icon: <MdOutlineHomeRepairService size={40} color="#1b263b" />,
              title: "Home Mastery Core",
              desc: "Multi-room automation with integrated lighting, shades, climate, audio, and family routines.",
            },
            {
              icon: <FaHandsHelping size={40} color="#1b263b" />,
              title: "Total Transformation",
              desc: "Full renovation + automation: design, finishes, wiring, premium lighting/audio, and custom smart living scenes.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                flex: "1 1 250px",
                maxWidth: "300px",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
              <h3 style={{ color: "#1b263b" }}>{item.title}</h3>
              <p style={{ color: "#1b263b" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* A-la-carte Upgrades */}
      <section style={{ padding: "3rem 2rem", backgroundColor: "#f0f4f8" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>
          A-la-carte Upgrades
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
              icon: <FaPaintRoller size={40} color="#1b263b" />,
              title: "Paint Refresh & Accents",
              desc: "Transform mood and clarity with colors and finishes.",
            },
            {
              icon: <FaLightbulb size={40} color="#1b263b" />,
              title: "Lighting Upgrades",
              desc: "Dimmers, accent strips, and switch replacements for instant atmosphere.",
            },
            {
              icon: <FaCogs size={40} color="#1b263b" />,
              title: "Smart Starters",
              desc: "Plugs, sensors, and shades to automate what matters most right now.",
            },
            {
              icon: <FaUsers size={40} color="#1b263b" />,
              title: "Organization Touches",
              desc: "Cable management, discreet storage, and clutter control for a calm space.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                flex: "1 1 250px",
                maxWidth: "300px",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
              <h3 style={{ color: "#1b263b" }}>{item.title}</h3>
              <p style={{ color: "#1b263b" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: "3rem 2rem" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>How We Work</h2>
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
            <strong>Discovery:</strong> Walkthrough of needs, routines, and
            style.
          </li>
          <li>
            <strong>Design:</strong> Clear plan with minimal to full-reno
            options.
          </li>
          <li>
            <strong>Build & Integrate:</strong> Clean installs, premium
            finishes, smooth setup.
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

      {/* CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          backgroundColor: "#f5f7fa",
        }}
      >
        <h2 style={{ color: "#1b263b" }}>Live Like the Master of Your Home</h2>
        <p
          style={{
            maxWidth: "800px",
            margin: "1rem auto",
            fontSize: "1.2rem",
            color: "#1b263b",
          }}
        >
          Whether it’s small smart upgrades or complete transformations, we’ll
          help you create a home that feels modern, secure, and uniquely yours.
        </p>
        <button
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#1b263b",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Contact Us
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
