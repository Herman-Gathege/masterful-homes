import React, { useState } from "react";
import Footer from "../components/Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message submitted! We'll be in touch soon.");
    // Optionally, send formData to a backend here
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div style={{ backgroundColor: "#f5f7fa", fontFamily: "sans-serif", marginTop: "120px" }}>
      <h1 style={{ textAlign: "center", color: "#1b263b" }}>Contact Us</h1>
      <p style={{ textAlign: "center", color: "#1b263b", maxWidth: "600px", margin: "0 auto" }}>
        Got questions, feedback, or just want to say hello? Fill out the form below and we'll get back to you as soon as we can.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "600px",
          margin: "2rem auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Your Name"
          onChange={handleChange}
          required
          style={{ padding: "1rem", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Your Email"
          onChange={handleChange}
          required
          style={{ padding: "1rem", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <textarea
          name="message"
          value={formData.message}
          placeholder="Your Message"
          rows={6}
          onChange={handleChange}
          required
          style={{ padding: "1rem", borderRadius: "5px", border: "1px solid #ccc" }}
        ></textarea>
        <button
          type="submit"
          style={{
            padding: "1rem",
            backgroundColor: "#1b263b",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Send Message
        </button>
      </form>
      <Footer />
    </div>
  );
};

export default ContactUs;
