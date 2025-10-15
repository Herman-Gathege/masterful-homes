import React, { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../../../services/hrService";
import UserTable from "../components/UserTable";
import InviteModal from "../components/InviteModal";
import BulkImport from "../components/BulkImport";
import { AuthContext } from "../../../context/AuthContext";

export default function HRDirectory() {
  const { user } = useContext(AuthContext); // ✅ correct for your current AuthContext
  const tenantId = user?.tenant_id;

  const [filters, setFilters] = useState({ search: "", role: "", department: "" });
  const [limit, setLimit] = useState(25);
  const [offset, setOffset] = useState(0);
  const [showInvite, setShowInvite] = useState(false);
  const [showBulk, setShowBulk] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", tenantId, filters, limit, offset],
    queryFn: async () => {
      const res = await fetchUsers({ tenant_id: tenantId, ...filters, limit, offset });
      return res.data;
    },
    enabled: !!tenantId,
  });

  const handleSearchChange = (e) => setFilters({ ...filters, search: e.target.value });
  const handleRoleChange = (e) => setFilters({ ...filters, role: e.target.value });
  const handleDepartmentChange = (e) => setFilters({ ...filters, department: e.target.value });

  if (isLoading) return <div>Loading users...</div>;

  const users = data?.data || [];
  const total = data?.total || 0;

  return (
    <div style={{ padding: 20 }}>
      <h2>👥 HR Directory</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <input placeholder="Search name/email" value={filters.search} onChange={handleSearchChange} />
        <select value={filters.role} onChange={handleRoleChange}>
          <option value="">All Roles</option>
          <option value="manager">Manager</option>
          <option value="technician">Technician</option>
          <option value="employee">Employee</option>
        </select>
        <input placeholder="Department" value={filters.department} onChange={handleDepartmentChange} />
        <button onClick={() => refetch()}>🔍 Search</button>
        <button onClick={() => setShowInvite(true)}>➕ Invite</button>
        <button onClick={() => setShowBulk(true)}>📤 Bulk Import</button>
      </div>

      {/* Table */}
      <UserTable users={users} />

      {/* Pagination */}
      <div style={{ marginTop: 10 }}>
        <button disabled={offset === 0} onClick={() => setOffset(offset - limit)}>⬅ Prev</button>
        <span> {offset + 1}–{Math.min(offset + limit, total)} of {total} </span>
        <button disabled={offset + limit >= total} onClick={() => setOffset(offset + limit)}>Next ➡</button>
      </div>

      {showInvite && <InviteModal onClose={() => { setShowInvite(false); refetch(); }} />}
      {showBulk && <BulkImport onClose={() => { setShowBulk(false); refetch(); }} />}
    </div>
  );
}
