// frontend/src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import logo from "../assets/logo.jpeg";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#1b263b",
        color: "#fff",
        padding: "3rem 1rem",
        marginTop: "3rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* Logo + Tagline */}
        <div>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "#fff",
              marginBottom: "1rem",
            }}
          >
            <img
              src={logo}
              alt="DashWise Logo"
              style={{ height: "40px", marginRight: "10px" }}
            />
            <span style={{ fontWeight: "bold", fontSize: "20px" }}>
              DashWise
            </span>
          </Link>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
            The all-in-one business dashboard to manage teams, tasks, and
            compliance built for growth, designed for impact.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
            <li>
              <Link to="/about-us" style={{ color: "#fff", textDecoration: "none" }}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/services" style={{ color: "#fff", textDecoration: "none" }}>
                Services
              </Link>
            </li>
            <li>
              <Link to="/contact-us" style={{ color: "#fff", textDecoration: "none" }}>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/signup" style={{ color: "#fff", textDecoration: "none" }}>
                Get Started
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
            Contact
          </h4>
          <p style={{ margin: "0.3rem 0" }}>Email: support@dashwise.com</p>
          <p style={{ margin: "0.3rem 0" }}>Phone: +254 700 000 000</p>
          <p style={{ margin: "0.3rem 0" }}>Nairobi, Kenya</p>
        </div>

        {/* Social Links */}
        <div>
          <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
            Follow Us
          </h4>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#fff",
                fontSize: "1.2rem",
              }}
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#fff",
                fontSize: "1.2rem",
              }}
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#fff",
                fontSize: "1.2rem",
              }}
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#fff",
                fontSize: "1.2rem",
              }}
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          textAlign: "center",
          marginTop: "2rem",
          fontSize: "0.9rem",
          borderTop: "1px solid rgba(255,255,255,0.2)",
          paddingTop: "1rem",
        }}
      >
        <p>
          &copy; {new Date().getFullYear()} DashWise. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
