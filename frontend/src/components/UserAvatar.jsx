// src/components/UserAvatar.jsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import "../css/Navbar.css";

const UserAvatar = ({ onLogout }) => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarLetter =
    (user?.username && user.username[0]?.toUpperCase()) ||
    (user?.email && user.email[0]?.toUpperCase()) ||
    "?";

  return (
    <div ref={dropdownRef} style={{ position: "relative" }} className="user-avatar">
      <div
        onClick={toggleDropdown}
        className="user-avatar-circle"
        title={user?.username || user?.email || "Account"}
      >
        {user?.photoUrl ? (
          <img
            src={user.photoUrl}
            alt="avatar"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          avatarLetter
        )}
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            right: 0,
            background: "#fff",
            color: "#222",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
            width: "180px",
            zIndex: 2000,
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: "8px 0" }}>
            <li>
              <NavLink
                to="/dashboard"
                onClick={() => setOpen(false)}
                style={({ isActive }) => ({
                  padding: "10px 15px",
                  display: "block",
                  color: isActive ? "#1b263b" : "#333",
                  textDecoration: "none",
                })}
              >
                Dashboard
              </NavLink>
            </li>
            <li
              style={{ padding: "10px 15px", cursor: "pointer" }}
              onClick={() => {
                setOpen(false);
                alert("Go to Settings");
              }}
            >
              Settings
            </li>
            <li
              style={{ padding: "10px 15px", cursor: "pointer" }}
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
