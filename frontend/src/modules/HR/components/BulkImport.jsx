import React, { useState, useContext } from "react";
import { bulkImport } from "../../../services/hrService";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "../../../utils/toast";
import "../../../css/Modal.css";

export default function BulkImport({ onClose }) {
  const { user } = useContext(AuthContext);
  const tenantId = user?.tenant_id;

  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast?.error?.("Please select a CSV file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenant_id", tenantId);

    setLoading(true);
    try {
      const res = await bulkImport(formData);
      setResults(res.data);
      toast?.success?.("✅ Bulk import completed");
    } catch (err) {
      console.error(err);
      toast?.error?.("❌ Bulk import failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      "email,full_name,role,department,team,location,is_active\n" +
      "example@company.com,John Doe,technician,Core,Team 1,Nairobi,true";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bulk_import_template.csv";
    link.click();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3 style={{ color: "#053f5c", marginBottom: "1rem" }}>Bulk Import Users</h3>

        <form onSubmit={handleUpload}>
          <label>Select CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>

        <button
          type="button"
          onClick={downloadTemplate}
          style={{
            marginTop: "10px",
            fontSize: "0.9rem",
            color: "#075e84",
            textDecoration: "underline",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          📄 Download CSV Template
        </button>

        {results && (
          <div style={{ marginTop: "20px" }}>
            <h4 style={{ color: "#053f5c" }}>Summary</h4>
            <p>✅ Created: {results.created}</p>
            <p>⚠️ Skipped: {results.skipped}</p>
            {results.errors?.length > 0 && (
              <>
                <h5 style={{ color: "#c95050" }}>Errors:</h5>
                <ul>
                  {results.errors.map((e, i) => (
                    <li key={i}>Row {e.row}: {e.error}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
