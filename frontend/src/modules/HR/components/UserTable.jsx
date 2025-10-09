import React, { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react"; // Tailwind + lucide-react icon

function UserTable({ users = [], onUserClick }) {
  const [sortField, setSortField] = useState("full_name");
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedUsers = useMemo(() => {
    const sorted = [...users];
    sorted.sort((a, b) => {
      const valA = a[sortField]?.toString().toLowerCase() || "";
      const valB = b[sortField]?.toString().toLowerCase() || "";
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [users, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (!users.length) {
    return <p className="text-gray-500">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            {[
              { key: "full_name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "role", label: "Role" },
              { key: "department", label: "Department" },
              { key: "team", label: "Team" },
              { key: "last_login", label: "Last Login" },
            ].map(({ key, label }) => (
              <th
                key={key}
                className="p-2 border-b text-left cursor-pointer select-none hover:bg-gray-200 transition"
                onClick={() => handleSort(key)}
              >
                <div className="flex items-center gap-1">
                  {label}
                  <ArrowUpDown
                    size={14}
                    className={`${
                      sortField === key
                        ? "text-blue-500"
                        : "text-gray-400 opacity-70"
                    }`}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((u) => (
            <tr
              key={u.id}
              className="cursor-pointer hover:bg-blue-50 transition"
              onClick={() => onUserClick && onUserClick(u)}
            >
              <td className="p-2 border-b">{u.full_name}</td>
              <td className="p-2 border-b">{u.email}</td>
              <td className="p-2 border-b capitalize">{u.role}</td>
              <td className="p-2 border-b">{u.department}</td>
              <td className="p-2 border-b">{u.team}</td>
              <td className="p-2 border-b">{u.last_login}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
