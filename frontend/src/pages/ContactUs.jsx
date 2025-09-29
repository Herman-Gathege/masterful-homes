// src/pages/ContactUs.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message submitted! We'll be in touch soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", marginTop: "80px" }}>
      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "5rem 2rem",
          backgroundColor: "#f5f7fa",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontSize: "3rem", color: "#053f5c", fontWeight: "700" }}
        >
          Get in Touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: "700px",
            margin: "1.5rem auto",
            fontSize: "1.2rem",
            color: "#053f5c",
          }}
        >
          Have questions, feedback, or ideas? We’d love to hear from you.
          Fill out the form or reach us directly through the details below.
        </motion.p>
      </section>

      {/* Contact Form + Info */}
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "3rem",
          padding: "5rem 2rem",
          backgroundColor: "#fff",
        }}
      >
        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            flex: "1 1 400px",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
            background: "#f9f9f9",
            padding: "2.5rem",
            borderRadius: "12px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            borderTop: "4px solid #053f5c",
          }}
        >
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Your Name"
            onChange={handleChange}
            required
            style={{
              padding: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Your Email"
            onChange={handleChange}
            required
            style={{
              padding: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <textarea
            name="message"
            value={formData.message}
            placeholder="Your Message"
            rows={6}
            onChange={handleChange}
            required
            style={{
              padding: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          ></textarea>
          <button
            type="submit"
            style={{
              padding: "1rem",
              backgroundColor: "#053f5c",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#032a3e")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#053f5c")}
          >
            Send Message
          </button>
        </motion.form>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            flex: "1 1 300px",
            maxWidth: "400px",
            padding: "1rem",
          }}
        >
          <h3 style={{ color: "#053f5c", marginBottom: "1.5rem", fontWeight: "600" }}>
            Reach Us Directly
          </h3>
          <p style={{ color: "#053f5c", marginBottom: "1.5rem" }}>
            We’re always happy to connect with you. Contact us via phone,
            email, or visit our office.
          </p>
          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              color: "#053f5c",
            }}
          >
            <FaEnvelope /> <span>support@dashwise.com</span>
          </div>
          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              color: "#053f5c",
            }}
          >
            <FaPhone /> <span>+123 456 7890</span>
          </div>
          <div
            style={{
              marginBottom: "2rem",
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              color: "#053f5c",
            }}
          >
            <FaMapMarkerAlt /> <span>Nairobi, Kenya</span>
          </div>
          <motion.img
            src="/src/assets/map-placeholder.png"
            alt="Office Location"
            style={{
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
