// UserSelector.jsx
import React, { useState } from "react";
import axiosInstance from "../context/axiosInstance";
import "../css/UserSelector.css";

const UserSelector = ({ onSelectUser }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchUsers = async () => {
    if (!query.trim()) return;
    try {
      const res = await axiosInstance.get(`/users/search?q=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <div className="user-selector-container">
      <div className="user-selector-input-group">
        <p>Search for a user:</p>
        <input
          type="text"
          className="user-selector-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="by name, email, or school ID"
        />
        <button className="user-selector-button" onClick={searchUsers}>
          Search
        </button>
      </div>

      <div className="user-selector-results">
        {results.map((user) => (
          <div
            key={user.id}
            className="user-selector-item"
            onClick={() => onSelectUser(user)}
          >
            <span className="user-selector-name">
              {user.username || user.email || user.school_id}
            </span>
            <span className="user-selector-role">({user.role})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSelector;
