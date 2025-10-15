import React, { useState, useContext } from "react";
import { inviteUser } from "../../../services/hrService";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "../../../utils/toast";
import "../../../css/Modal.css";

export default function InviteModal({ onClose }) {
  const { user } = useContext(AuthContext);
  const tenantId = user?.tenant_id;

  const [form, setForm] = useState({
    email: "",
    full_name: "",
    role: "employee",
    department: "",
    team: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, tenant_id: tenantId };
      const res = await inviteUser(payload);
      toast?.success?.("✅ Invite created!");
      console.log("Invite response:", res.data);
      onClose();
    } catch (err) {
      console.error(err);
      toast?.error?.("❌ Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Sticky Header Section */}
        <div className="modal-header">
          <h3 style={{ color: "#053f5c", margin: 0 }}>Invite New User</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <label>Email *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Full Name</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
          />

          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="manager">Manager</option>
            <option value="technician">Technician</option>
            <option value="employee">Employee</option>
          </select>

          <label>Department</label>
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
          />

          <label>Team</label>
          <input
            name="team"
            value={form.team}
            onChange={handleChange}
          />

          <label>Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Invite"}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
