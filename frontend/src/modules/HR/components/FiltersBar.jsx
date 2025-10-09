import React from "react";

function FiltersBar({ filters, setFilters }) {
  const roles = ["admin", "manager", "technician"];
  const departments = ["Finance", "Core", "Support"];

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", role: "", department: "" });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={filters.search}
        onChange={(e) => handleChange("search", e.target.value)}
        className="flex-1 min-w-[200px] px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
      />

      {/* 🧩 Role Dropdown */}
      <select
        value={filters.role}
        onChange={(e) => handleChange("role", e.target.value)}
        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
      >
        <option value="">All Roles</option>
        {roles.map((r) => (
          <option key={r} value={r}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </option>
        ))}
      </select>

      {/* 🏢 Department Dropdown */}
      <select
        value={filters.department}
        onChange={(e) => handleChange("department", e.target.value)}
        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
      >
        <option value="">All Departments</option>
        {departments.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* ❌ Clear Filters */}
      <button
        onClick={clearFilters}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition"
      >
        Clear
      </button>
    </div>
  );
}

export default FiltersBar;
