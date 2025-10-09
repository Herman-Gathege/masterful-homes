import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../context/axiosInstance";
import FiltersBar from "../components/FiltersBar";
import UserTable from "../components/UserTable";
import InviteModal from "../components/InviteModal";
import BulkImport from "../components/BulkImport";
import UserDetailsModal from "../components/UserDetailsModal";

function UserDirectory() {
  const [useMock, setUseMock] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    department: "",
  });
  const [page, setPage] = useState(1);
  const limit = 5;

  // ✅ Mock data in state
  const [mockData, setMockData] = useState([
    { id: 1, full_name: "Jane Doe", email: "jane.doe@example.com", role: "manager", department: "Finance", team: "Alpha", last_login: "2025-10-05" },
    { id: 2, full_name: "John Smith", email: "john.smith@example.com", role: "technician", department: "Core", team: "Bravo", last_login: "2025-10-07" },
    { id: 3, full_name: "Mary Wanjiku", email: "mary@example.com", role: "technician", department: "Core", team: "Delta", last_login: "2025-09-30" },
    { id: 4, full_name: "David Kim", email: "david.kim@example.com", role: "admin", department: "Support", team: "Ops", last_login: "2025-10-02" },
    { id: 5, full_name: "Eunice Njoroge", email: "eunice@example.com", role: "manager", department: "Finance", team: "Echo", last_login: "2025-10-01" },
    { id: 6, full_name: "Brian Otieno", email: "brian@example.com", role: "technician", department: "Core", team: "Charlie", last_login: "2025-09-29" },
    { id: 7, full_name: "Alice Muthoni", email: "alice@example.com", role: "admin", department: "Support", team: "Ops", last_login: "2025-10-03" },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Backend fetch with JWT logs
  const { data: backendData, isLoading, error, refetch } = useQuery({
    queryKey: ["users", filters, page],
    queryFn: async () => {
      console.log("📡 Fetching users from backend...");
      const res = await axiosInstance.get("/users", {
        params: {
          role: filters.role || undefined,
          department: filters.department || undefined,
          search: filters.search || undefined,
          limit,
          offset: (page - 1) * limit,
        },
      });
      console.log("✅ Backend users:", res.data);
      return res.data;
    },
    enabled: !useMock,
  });

  // ✅ Filter + paginate mock data
  const filteredUsers = useMemo(() => {
    let result = mockData;

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (u) =>
          u.full_name.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s)
      );
    }

    if (filters.role) result = result.filter((u) => u.role === filters.role);
    if (filters.department)
      result = result.filter((u) => u.department === filters.department);

    return result;
  }, [filters, mockData]);

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / limit);

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * limit,
    page * limit
  );

  // ✅ use backend when toggled
  const users = useMock ? paginatedUsers : backendData?.data || [];

  // ---- HANDLERS ----
  const handleInvite = (email) => alert(`Mock invite sent to ${email}`);
  const handleImport = (file) => alert(`Mock import started for ${file.name}`);

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  const handleUserClick = (user) => setSelectedUser(user);

  const handleSaveUser = async (updatedUser) => {
    if (useMock) {
      setMockData((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
    } else {
      try {
        console.log("📝 Updating user via backend:", updatedUser);
        await axiosInstance.put(`/users/${updatedUser.id}`, updatedUser);
        await refetch();
        console.log("✅ Backend user updated.");
      } catch (err) {
        console.error("❌ Backend update failed:", err);
        alert("Failed to update user in backend");
      }
    }

    setSelectedUser(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">User Directory</h2>
        <button
          onClick={() => setUseMock((prev) => !prev)}
          className={`px-4 py-2 rounded text-white ${
            useMock ? "bg-gray-500" : "bg-blue-600"
          }`}
        >
          {useMock ? "Switch to Backend Mode" : "Switch to Mock Mode"}
        </button>
      </div>

      {/* Filters + Actions */}
      <FiltersBar filters={filters} setFilters={setFilters} />
      <div className="flex gap-4 mb-4">
        <InviteModal onInvite={handleInvite} />
        <BulkImport onImport={handleImport} />
      </div>

      {/* Table */}
      {isLoading && !useMock && <p>Loading users...</p>}
      {error && !useMock && (
        <p className="text-red-500">Error loading users</p>
      )}

      <UserTable users={users} onUserClick={handleUserClick} />

      {/* ✅ Pagination Controls */}
      {useMock && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-3">
          <p className="text-gray-600 text-sm">
            Showing {(page - 1) * limit + 1}–
            {Math.min(page * limit, totalUsers)} of {totalUsers} users
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded transition ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}

export default UserDirectory;
