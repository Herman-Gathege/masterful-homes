//frontend/src/modules/Time/pages/ShiftFormModal.jsx
import React, { useState, useContext, useEffect } from "react";
import Modal from "../../../components/Modal";
import { AuthContext } from "../../../context/AuthContext";
import { useCreateShift, useDeleteShift } from "../../../services/timeService";
import moment from "moment";
import { toast } from "../../../utils/toast";

const ShiftFormModal = ({ selectedRange, selectedEvent, onClose }) => {
  const { user } = useContext(AuthContext);
  const createShift = useCreateShift();
  const deleteShift = useDeleteShift();
  const isManager = ["manager", "admin"].includes(user?.role?.toLowerCase());


  // Convert ISO/Date -> local datetime-local value: "YYYY-MM-DDTHH:mm"
  const isoToLocalInput = (isoOrDate) => {
    if (!isoOrDate) return "";
    // Accept Date object or ISO string
    const m = moment(isoOrDate);
    if (!m.isValid()) return "";
    return m.local().format("YYYY-MM-DDTHH:mm");
  };

  // Convert local input -> ISO string to send to backend
  const localInputToIso = (localVal) => {
    if (!localVal) return null;
    // interpret localVal as local time (browser), convert to ISO (UTC)
    return moment(localVal).toISOString();
  };

  // initial form (sync with props)
  const [form, setForm] = useState({
    title: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    if (selectedRange || selectedEvent) {
      setForm({
        title: selectedEvent?.title || "",
        start_time:
          isoToLocalInput(selectedEvent?.start) || isoToLocalInput(selectedRange?.start) || "",
        end_time:
          isoToLocalInput(selectedEvent?.end) || isoToLocalInput(selectedRange?.end) || "",
      });
    }
  }, [selectedRange, selectedEvent]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Submit: create new shift, or if editing, delete old shift then create new (simple update)
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  const payload = {
    tenant_id: user?.tenant_id,
    start_time: localInputToIso(form.start_time),
    end_time: localInputToIso(form.end_time),
    description: form.title,
  };

  try {
    if (selectedEvent) {
      await deleteShift.mutateAsync(selectedEvent.id);
      await createShift.mutateAsync(payload);
    } else {
      await createShift.mutateAsync(payload);
    }
    toast.success("Shift saved successfully!");
    onClose(true);
  } catch (err) {
    console.error("Shift save failed", err);
    toast.error("Failed to save shift");
    setError(err?.message || "Failed to save shift");
  } finally {
    setLoading(false);
  }
};

const handleDelete = async () => {
  if (!selectedEvent) return;
  if (!window.confirm("Are you sure you want to delete this shift?")) return;

  try {
    setLoading(true);
    await deleteShift.mutateAsync(selectedEvent.id);
    toast.success("Shift deleted successfully.");
    onClose(true);
  } catch (err) {
    console.error("Delete failed", err);
    toast.error("Failed to delete shift");
    setError(err?.message || "Failed to delete");
  } finally {
    setLoading(false);
  }
};


  const isOpen = !!(selectedRange || selectedEvent);

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)}>
      <div style={{ maxWidth: 420 }}>
        <h3 style={{ color: "#053f5c", marginBottom: "1rem" }}>
          {selectedEvent ? "Edit Shift" : "Create New Shift"}
        </h3>

        {error && (
          <div style={{ color: "#b63e3e", marginBottom: 8 }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ fontWeight: 600, color: "#053f5c" }}>Title / Description</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Shift title"
            required
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd", marginBottom: 10 }}
          />

          <label style={{ fontWeight: 600, color: "#053f5c" }}>Start Time</label>
          <input
            type="datetime-local"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd", marginBottom: 10 }}
          />

          <label style={{ fontWeight: 600, color: "#053f5c" }}>End Time</label>
          <input
            type="datetime-local"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd", marginBottom: 14 }}
          />

          <div className="modal-actions" style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            {isManager && (
              <button
              type="submit"
              disabled={loading}
              style={{
                background: "#053f5c",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              {selectedEvent ? "Update" : "Create"}
            </button>
            )}
            

            {isManager && selectedEvent && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                style={{
                  background: "#c95050",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            )}

            <button
              type="button"
              onClick={() => onClose(false)}
              disabled={loading}
              style={{
                background: "#e6e6e6",
                color: "#222",
                padding: "8px 12px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ShiftFormModal;
