// frontend/src/modules/HR/components/UserTable.jsx
import React from "react";
import "../../../css/UserTableHr.css";


export default function UserTable({ users }) {
  if (!users.length)
    return <div className="empty">No users found.</div>;

  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Team</th>
            <th>Active</th>
            <th>Last Login</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.full_name || "—"}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.department || "—"}</td>
              <td>{u.team || "—"}</td>
              <td>{u.is_active ? "✅" : "❌"}</td>
              <td>{u.last_login ? new Date(u.last_login).toLocaleString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
