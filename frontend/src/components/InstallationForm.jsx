import React, { useState } from "react";
import axiosInstance from "../context/axiosInstance";
import "../css/InstallationForm.css";

function InstallationForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    customer_name: "",
    package_type: "QuickStart",
    status: "Lead",
    technician_id: "",
    scheduled_date: "",
    end_date: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert to ISO datetime if values exist
      const payload = {
        ...formData,
        scheduled_date: formData.scheduled_date
          ? new Date(formData.scheduled_date).toISOString()
          : null,
        end_date: formData.end_date
          ? new Date(formData.end_date).toISOString()
          : null,
      };

      await axiosInstance.post("/installations", payload);
      setMessage("✅ Installation created successfully!");
      setFormData({
        customer_name: "",
        package_type: "QuickStart",
        status: "Lead",
        technician_id: "",
        scheduled_date: "",
        end_date: "",
      });
      if (onSuccess) onSuccess(); // refresh parent table
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
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Lead">Lead</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <label>Technician ID (optional):</label>
        <input
          type="number"
          name="technician_id"
          value={formData.technician_id}
          onChange={handleChange}
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
