import React, { useState, useEffect } from "react";
import axiosInstance from "../context/axiosInstance";
import Customer360Modal from "./Customer360Modal";
import "../css/InstallationsTable.css";

function InstallationsTable() {
  const [installations, setInstallations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadInstallations = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/installations");
      setInstallations(res.data);
    } catch (err) {
      console.error("Failed to fetch installations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstallations();
  }, []);

  const startEditing = (installation) => {
    setEditingId(installation.id);
    // Convert ISO datetimes into `YYYY-MM-DDTHH:mm` format for datetime-local
    setEditedData({
      ...installation,
      scheduled_date: installation.scheduled_date
        ? installation.scheduled_date.slice(0, 16)
        : "",
      end_date: installation.end_date ? installation.end_date.slice(0, 16) : "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const saveChanges = async (id) => {
    try {
      const payload = {
        ...editedData,
        scheduled_date: editedData.scheduled_date
          ? new Date(editedData.scheduled_date).toISOString()
          : null,
        end_date: editedData.end_date
          ? new Date(editedData.end_date).toISOString()
          : null,
      };

      await axiosInstance.put(`/installations/${id}`, payload);
      setEditingId(null);
      loadInstallations();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const deleteInstallation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this installation?"))
      return;
    try {
      await axiosInstance.delete(`/installations/${id}`);
      loadInstallations();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="installations-table-container">
      <h3>Installations & Pipeline</h3>
      {loading ? (
        <p>Loading installations...</p>
      ) : (
        <table className="installations-table" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Package</th>
              <th>Status</th>
              <th>Technician</th>
              <th>Scheduled Date</th>
              <th>End Date</th>
              <th>Price</th>
              <th>Actions</th>
              <th>View Customer</th>
            </tr>
          </thead>
          <tbody>
            {installations.map((i) => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>
                  {editingId === i.id ? (
                    <input
                      name="customer_name"
                      value={editedData.customer_name}
                      onChange={handleChange}
                    />
                  ) : (
                    i.customer_name
                  )}
                </td>
                <td>
                  {editingId === i.id ? (
                    <select
                      name="package_type"
                      value={editedData.package_type}
                      onChange={handleChange}
                    >
                      <option value="QuickStart">QuickStart</option>
                      <option value="Core">Core</option>
                      <option value="Total">Total</option>
                    </select>
                  ) : (
                    i.package_type
                  )}
                </td>
                <td>
                  {editingId === i.id ? (
                    <select
                      name="status"
                      value={editedData.status}
                      onChange={handleChange}
                    >
                      <option value="Lead">Lead</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : (
                    i.status
                  )}
                </td>
                <td>
                  {editingId === i.id ? (
                    <input
                      name="technician_id"
                      value={editedData.technician_id || ""}
                      onChange={handleChange}
                      placeholder="Technician ID"
                    />
                  ) : (
                    i.technician_name || "Unassigned"
                  )}
                </td>
                <td>
                  {editingId === i.id ? (
                    <input
                      type="datetime-local"
                      name="scheduled_date"
                      value={editedData.scheduled_date || ""}
                      onChange={handleChange}
                    />
                  ) : i.scheduled_date ? (
                    new Date(i.scheduled_date).toLocaleString()
                  ) : (
                    "Not Scheduled"
                  )}
                </td>
                <td>
                  {editingId === i.id ? (
                    <input
                      type="datetime-local"
                      name="end_date"
                      value={editedData.end_date || ""}
                      onChange={handleChange}
                    />
                  ) : i.end_date ? (
                    new Date(i.end_date).toLocaleString()
                  ) : (
                    "Not Set"
                  )}
                </td>
                <td>
                  {editingId === i.id ? (
                    <input
                      type="number"
                      name="price"
                      value={editedData.price || ""}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  ) : i.price ? (
                    `$${i.price.toFixed(2)}`
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {editingId === i.id ? (
                    <>
                      <button onClick={() => saveChanges(i.id)}>Save</button>
                      <button onClick={cancelEditing}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(i)}>Edit</button> 
                      <button onClick={() => deleteInstallation(i.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
                <td>
                  <button
                    className="link-button"
                    onClick={() => setSelectedCustomer(i.customer_id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Customer360Modal
        customerId={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}

export default InstallationsTable;
