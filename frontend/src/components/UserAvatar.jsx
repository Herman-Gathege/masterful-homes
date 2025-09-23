// // src/components/UserAvatar.jsx

import React, { useState, useRef, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const UserAvatar = ({ onLogout }) => {
  const { user, role } = useContext(AuthContext); // Access user and role from AuthContext
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

  const getDashboardLabel = () =>
    role === "admin"
      ? "Admin Panel"
      : role === "manager"
      ? "Manager Hub"
      : role === "technician"
      ? "Tech Center"
      : role === "finance"
      ? "Finance Portal"
      : "Dashboard";

  const avatarLetter = user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?";

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <div
        onClick={toggleDropdown}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: "#f4d03f",
          color: "#1b263b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          cursor: "pointer",
          userSelect: "none",
        }}
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
            background: "#e9ebecff", // From SearchBar.css results background
            color: "#455a70", // From SearchBar.css text
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
            width: "160px",
            zIndex: 2000,
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: "8px 0" }}>
            <li>
              <NavLink
                to={`/dashboard/${role}`}
                onClick={() => setOpen(false)}
                style={({ isActive }) => ({
                  ...menuItemStyle,
                  color: isActive ? "#1b263b" : "#455a70",
                  background: isActive ? "#778da9" : "transparent",
                })}
              >
                {getDashboardLabel()}
              </NavLink>
            </li>
            <li
              style={menuItemStyle}
              onClick={() => alert("Go to Settings")} // Placeholder retained
            >
              Settings
            </li>
            <li
              style={menuItemStyle}
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

const menuItemStyle = {
  padding: "10px 15px",
  cursor: "pointer",
  transition: "background 0.2s, color 0.2s",
  display: "block",
  color: "#455a70", // From SearchBar.css text
};

export default UserAvatar;