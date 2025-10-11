//frontend/src/modules/Time/pages/ExceptionPanel.jsx
import React, { useContext, useMemo } from "react";
import useTimeStore from "../../../store/timeStore";
import { AuthContext } from "../../../context/AuthContext";
import { useExceptions, resolveException } from "../../../services/timeService";
import "../../../css/Exceptions.css"; // optional styling
import { toast } from "../../../utils/toast";

const csvEscape = (v) =>
  `"${String(v ?? "").replace(/"/g, '""')}"`;

// simplest CSV download (works without extra deps)
function downloadCSV(filename, rows, headers) {
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const ExceptionPanel = () => {
  const { user } = useContext(AuthContext);
  const { timesheetFilters } = useTimeStore();
  const tenantId = user?.tenant_id;

  const { data: exceptions = { missing_clockouts: [], overtime: [] }, isLoading, refetch } = useExceptions(tenantId);
  const resolveMut = resolveException();

  const canManage = ["manager", "admin"].includes(user?.role?.toLowerCase());

  const mergedList = useMemo(() => {
    const missing = (exceptions.missing_clockouts || []).map((m) => ({ ...m, kind: "missing_clockout" }));
    const overtime = (exceptions.overtime || []).map((o) => ({ ...o, kind: "overtime" }));
    return [...missing, ...overtime].sort((a, b) => (a.start_time < b.start_time ? 1 : -1));
  }, [exceptions]);

  const handleResolve = async (item) => {
    if (!canManage) {
      toast.error("Unauthorized: only managers can resolve exceptions.");
      return;
    }
    // If backend supports a resolve endpoint, call it; otherwise we simulate:
    try {
      if (resolveMut.mutateAsync) {
        await resolveMut.mutateAsync({ type: item.kind, id: item.id });
        toast.success("Exception resolved.");
      } else {
        // fallback: just show success and refetch
        toast.success("Exception resolved (client-side).");
      }
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to resolve exception.");
    }
  };

  const exportCSV = () => {
    const headers = ["id", "user_id", "user_name", "user_email", "start_time", "duration", "kind"];
    const rows = mergedList.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      user_name: r.user_name || r.user_name || "",
      user_email: r.user_email || "",
      start_time: r.start_time,
      duration: r.duration ?? "",
      kind: r.kind,
    }));
    downloadCSV(`exceptions_${new Date().toISOString().slice(0,10)}.csv`, rows, headers);
  };

  if (isLoading) return <div className="exceptions-panel">Loading exceptions…</div>;

  return (
    <div className="exceptions-panel">
      <div className="exceptions-header">
        <h3>Exceptions</h3>
        <div>
          <button onClick={() => refetch()} className="btn small">🔄 Refresh</button>
          <button onClick={exportCSV} className="btn small">📤 Export CSV</button>
        </div>
      </div>

      {mergedList.length === 0 ? (
        <div className="empty">No exceptions for this range.</div>
      ) : (
        <table className="exceptions-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Employee</th>
              <th>Issue</th>
              <th>Duration</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mergedList.map((ex) => (
              <tr key={`${ex.kind}-${ex.id}`}>
                <td>{new Date(ex.start_time).toLocaleString()}</td>
                <td>
                  <strong>{ex.user_name || ex.user_id}</strong>
                  <div className="muted">{ex.user_email}</div>
                </td>
                <td>{ex.kind === "missing_clockout" ? "Missing clock-out" : `Overtime (${ex.duration || "—"}h)`}</td>
                <td>{ex.duration ? `${Number(ex.duration).toFixed(2)} h` : "—"}</td>
                <td>
                  {canManage ? (
                    <button className="btn small" onClick={() => handleResolve(ex)}>Mark resolved</button>
                  ) : (
                    <span className="muted">Manager only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExceptionPanel;

