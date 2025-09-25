//frontend/src/components/InstallationForm.jsx

import React, { useState, useEffect } from "react";
import axiosInstance from "../context/axiosInstance";
import "../css/InstallationForm.css";

function InstallationForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    package_type: "QuickStart",
    status: "Lead",
    technician_id: "",   // ✅ use id instead of name
    scheduled_date: "",
    end_date: "",
    price: "",
  });
  const [technicians, setTechnicians] = useState([]); // ✅ store technicians
  const [message, setMessage] = useState("");

  // ✅ Fetch technicians on load
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const res = await axiosInstance.get("/technicians");
        setTechnicians(res.data);
      } catch (err) {
        console.error("Failed to fetch technicians", err);
      }
    };
    fetchTechnicians();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        technician_id: formData.technician_id || null, // ensure correct key
        scheduled_date: formData.scheduled_date
          ? new Date(formData.scheduled_date).toISOString()
          : null,
        end_date: formData.end_date
          ? new Date(formData.end_date).toISOString()
          : null,
        price: formData.price ? parseFloat(formData.price) : null,
      };

      await axiosInstance.post("/installations", payload);
      setMessage("✅ Installation created successfully!");
      setFormData({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        package_type: "QuickStart",
        status: "Lead",
        technician_id: "",
        scheduled_date: "",
        end_date: "",
        price: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error creating installation", err);
      setMessage("❌ Failed to create installation.");
    }
  };

  return (
    <div>
      <h3>New Installation</h3>
      <form onSubmit={handleSubmit}>
        <label>Customer Name:</label>
        <input
          type="text"
          name="customer_name"
          value={formData.customer_name}
          onChange={handleChange}
          required
        />

        <label>Customer Email:</label>
        <input
          type="email"
          name="customer_email"
          value={formData.customer_email}
          onChange={handleChange}
          required
        />

        <label>Customer Phone (optional):</label>
        <input
          type="text"
          name="customer_phone"
          value={formData.customer_phone}
          onChange={handleChange}
        />

        <label>Package Type:</label>
        <select
          name="package_type"
          value={formData.package_type}
          onChange={handleChange}
        >
          <option value="QuickStart">QuickStart</option>
          <option value="Core">Core</option>
          <option value="Total">Total</option>
        </select>

        <label>Status:</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Lead">Lead</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <label>Assign Technician (optional):</label>
        <select
          name="technician_id"
          value={formData.technician_id}
          onChange={handleChange}
        >
          <option value="">-- Select Technician --</option>
          {technicians.map((tech) => (
            <option key={tech.id} value={tech.id}>
              {tech.username} ({tech.email})
            </option>
          ))}
        </select>

        <label>Price (USD):</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
        />

        <label>Scheduled Date & Time:</label>
        <input
          type="datetime-local"
          name="scheduled_date"
          value={formData.scheduled_date}
          onChange={handleChange}
        />

        <label>End Date & Time (optional):</label>
        <input
          type="datetime-local"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
        />

        <button type="submit" className="submit-btn">Create</button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
}

export default InstallationForm;
