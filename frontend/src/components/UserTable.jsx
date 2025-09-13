// src/components/UserTable.js
import React, { useState, useEffect } from "react";
import { fetchUsers, deleteUser, updateUser } from "../services/adminService";
import "../css/UserTable.css";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [filter, setFilter] = useState({ id: "", username: "", email: "" });

  // PAGINATION
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  // FILTERING
  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.id.toString().includes(filter.id) &&
      user.username.toLowerCase().includes(filter.username.toLowerCase()) &&
      user.email.toLowerCase().includes(filter.email.toLowerCase())
    );
  });

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const nextPage = () => {
    if (currentPage * usersPerPage < users.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Fetch all users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        loadUsers(); // Refresh user list
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const startEditing = (user) => {
    setEditingUserId(user.id);
    setEditedData({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditedData({});
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const saveChanges = async (userId) => {
    try {
      await updateUser(userId, editedData);
      setEditingUserId(null);
      loadUsers(); // Refresh user list
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="user-table-container">
      <h3>User Management Table</h3>
      <div style={{ marginBottom: "20px" }}>
        <input
          name="id"
          value={filter.id}
          onChange={handleFilterChange}
          placeholder="Filter by ID"
          style={{ marginRight: "10px", borderColor: "#1b263b" }}
        />
        <input
          name="username"
          value={filter.username}
          onChange={handleFilterChange}
          placeholder="Filter by Username"
          style={{ marginRight: "10px", borderColor: "#1b263b" }}
        />
        <input
          name="email"
          value={filter.email}
          onChange={handleFilterChange}
          placeholder="Filter by Email"
          style={{ marginRight: "10px", borderColor: "#1b263b" }}
        />
      </div>

      <table className="user-table" border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editingUserId === user.id ? (
                  <input
                    name="username"
                    value={editedData.username}
                    onChange={handleChange}
                  />
                ) : (
                  user.username
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <input
                    name="email"
                    value={editedData.email}
                    onChange={handleChange}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <select
                    name="role"
                    value={editedData.role}
                    onChange={handleChange}
                  >
                    <option value="admin">admin</option>
                    <option value="manager">manager</option>
                    <option value="technician">technician</option>
                    <option value="finance">finance</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <>
                    <button onClick={() => saveChanges(user.id)}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "10px" }}>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>Page {currentPage}</span>
        <button
          onClick={nextPage}
          disabled={currentPage * usersPerPage >= filteredUsers.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default UserTable;
