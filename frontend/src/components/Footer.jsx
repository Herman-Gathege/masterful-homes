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
import "../css/Footer.css"; // 👈 new stylesheet

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo + Tagline */}
        <div className="footer-section">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="DashWise Logo" />
            <span>DashWise</span>
          </Link>
          <p>
            The all-in-one business dashboard to manage teams, tasks, and
            compliance built for growth, designed for impact.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact</Link>
            </li>
            <li>
              <Link to="/signup">Get Started</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@dashwise.com</p>
          <p>Phone: +254 700 000 000</p>
          <p>Nairobi, Kenya</p>
        </div>

        {/* Social Links */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedinIn />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DashWise. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
