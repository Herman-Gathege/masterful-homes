// src/components/InvoiceTable.js
import React, { useState, useEffect } from "react";
import { fetchInvoices, deleteInvoice, updateInvoice } from "../services/invoiceService";
import "../css/InvoiceTable.css";

function InvoiceTable() {
  const [invoices, setInvoices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await fetchInvoices();
      setInvoices(data);
    } catch (err) {
      console.error("Failed to load invoices", err);
    }
  };

  const startEditing = (invoice) => {
    setEditingId(invoice.id);
    setEditedData(invoice);
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
      await updateInvoice(id, editedData);
      setEditingId(null);
      loadInvoices();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this invoice?")) {
      try {
        await deleteInvoice(id);
        loadInvoices();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  return (
    <div className="invoice-table-container">
      <h3>Invoices</h3>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Installation</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{inv.installation?.customer_name || "N/A"}</td>
              <td>
                {editingId === inv.id ? (
                  <input
                    name="amount"
                    value={editedData.amount}
                    onChange={handleChange}
                  />
                ) : (
                  `$${inv.amount}`
                )}
              </td>
              <td>
                {editingId === inv.id ? (
                  <select
                    name="status"
                    value={editedData.status}
                    onChange={handleChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                ) : (
                  inv.status
                )}
              </td>
              <td>{new Date(inv.created_at).toLocaleDateString()}</td>
              <td>
                {editingId === inv.id ? (
                  <>
                    <button onClick={() => saveChanges(inv.id)}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(inv)}>Edit</button>
                    <button onClick={() => handleDelete(inv.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceTable;
