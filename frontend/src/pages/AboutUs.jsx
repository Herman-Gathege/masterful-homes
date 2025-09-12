import React from "react";
import Footer from "../components/Footer";
import { FaLightbulb, FaHome, FaHandsHelping, FaCogs, FaUserCheck } from "react-icons/fa"; 
import { MdDesignServices } from "react-icons/md";

const AboutUs = () => {
  return (
    <div style={{ backgroundColor: "#ffffff", fontFamily: "sans-serif" }}>
      {/* Intro Section */}
      <section style={{ textAlign: "center", padding: "3rem 1rem" }}>
        <h1 style={{ color: "#1b263b", fontSize: "3rem" }}>
          Smart Homes. Thoughtful Renovations.
        </h1>
        <p
          style={{
            maxWidth: "800px",
            margin: "1rem auto",
            color: "#1b263b",
            fontSize: "1.2rem",
          }}
        >
          At <strong>Masterful Homes</strong>, we believe your home should adapt
          to you. We combine smart technology and modern design so life feels
          easy, efficient, and pleasantly elevated.
        </p>
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
        <div style={{ flex: "1", maxWidth: "400px", textAlign: "center" }}>
          <FaLightbulb size={40} color="#1b263b" style={{ marginBottom: "1rem" }} />
          <h2 style={{ color: "#1b263b" }}>Our Mission</h2>
          <p style={{ color: "#1b263b" }}>
            To transform homes into responsive, efficient, and inspiring spaces
            through automation, thoughtful renovations, and personalized design.
          </p>
        </div>
        <div style={{ flex: "1", maxWidth: "400px", textAlign: "center" }}>
          <FaHome size={40} color="#1b263b" style={{ marginBottom: "1rem" }} />
          <h2 style={{ color: "#1b263b" }}>Our Vision</h2>
          <p style={{ color: "#1b263b" }}>
            A world where every home empowers its owners — balancing comfort,
            security, and sustainability with seamless living.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section
        style={{
          backgroundColor: "#f0f4f8",
          padding: "4rem 2rem",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#1b263b" }}>Our Story</h2>
        <p
          style={{
            maxWidth: "900px",
            margin: "2rem auto",
            color: "#1b263b",
            fontSize: "1.1rem",
            lineHeight: "1.8",
          }}
        >
          We started Masterful Homes with a simple belief: your space should
          serve you. Too often, homes feel complicated or outdated — either
          overloaded with tech that isn’t intuitive, or stuck in designs that no
          longer fit modern living. <br />
          <br />
          That’s why we built a service that blends automation and design. From
          quick smart-plug setups to full-scale renovations, our work ensures
          every home feels modern, efficient, and uniquely yours.
        </p>
      </section>

      {/* Why Choose Us */}
      <section style={{ backgroundColor: "#f0f4f8", padding: "4rem 2rem" }}>
        <h2 style={{ textAlign: "center", color: "#1b263b" }}>
          Why Choose Us?
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
              title: "Smart Innovation",
              desc: "From lighting to climate control, we integrate the latest technology to simplify daily living.",
            },
            {
              icon: <MdDesignServices size={40} color="#1b263b" />,
              title: "Thoughtful Design",
              desc: "Renovations that balance beauty with function — because great spaces look good and work perfectly.",
            },
            {
              icon: <FaHandsHelping size={40} color="#1b263b" />,
              title: "Dedicated Support",
              desc: "We guide you from design to installation to post-setup tweaks, ensuring your home evolves with you.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                width: "300px",
                marginBottom: "2rem",
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

      {/* Approach Section */}
      <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <FaUserCheck size={40} color="#1b263b" style={{ marginBottom: "1rem" }} />
        <h2 style={{ color: "#1b263b" }}>How We Work</h2>
        <p
          style={{
            maxWidth: "850px",
            margin: "2rem auto",
            color: "#1b263b",
            fontSize: "1.1rem",
            lineHeight: "1.8",
          }}
        >
          Every project starts with discovery — understanding your routines,
          style, and needs. From there, we design clear options, install with
          care, and train your household until it’s second nature. Our support
          doesn’t stop at delivery — we’re here as your life and home evolve.
        </p>
      </section>

      {/* Call to Action */}
      <section style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <h2 style={{ color: "#1b263b" }}>
          Ready to Master Your Living Space?
        </h2>
        <p
          style={{
            maxWidth: "800px",
            margin: "2rem auto",
            fontSize: "1.2rem",
            color: "#1b263b",
          }}
        >
          From small smart upgrades to complete transformations, we’re here to
          help you build a home that works beautifully — and feels uniquely
          yours.
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
