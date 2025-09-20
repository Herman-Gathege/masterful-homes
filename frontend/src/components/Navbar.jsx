import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NotificationsBell from "./NotificationsBell";
import logo from "../assets/logo.jpeg";
import UserAvatar from "./UserAvatar";

const Navbar = () => {
  const { authenticated, logout, role } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () =>
      window.innerWidth > 768 && menuOpen && setMenuOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

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

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav
      style={{
        backgroundColor: "#1b263b",
        padding: "8px 16px",
        color: "#fff",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "60px", // Reduced height to save space
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "#fff",
          }}
        >
          <img
            src={logo}
            alt="Masterful Homes"
            style={{ height: "24px", marginRight: "8px" }}
          />
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>
            Masterful Homes
          </span>
        </NavLink>
      </div>

      <ul
        className={`menu-links ${menuOpen ? "open" : ""}`}
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <li>
          <NavLink
            to="/about-us"
            onClick={() => setMenuOpen(false)}
            style={({ isActive }) => ({
              color: isActive ? "#f4d03f" : "#fff",
              textDecoration: "none",
              padding: "6px 8px",
              fontWeight: 500,
              borderBottom: isActive
                ? "2px solid #f4d03f"
                : "2px solid transparent",
              transition: "color 0.3s, border-color 0.3s",
            })}
          >
            Our Story
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/services"
            onClick={() => setMenuOpen(false)}
            style={({ isActive }) => ({
              color: isActive ? "#f4d03f" : "#fff",
              textDecoration: "none",
              padding: "6px 8px",
              fontWeight: 500,
              borderBottom: isActive
                ? "2px solid #f4d03f"
                : "2px solid transparent",
              transition: "color 0.3s, border-color 0.3s",
            })}
          >
            What we offer
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact-us"
            onClick={() => setMenuOpen(false)}
            style={({ isActive }) => ({
              color: isActive ? "#f4d03f" : "#fff",
              textDecoration: "none",
              padding: "6px 8px",
              fontWeight: 500,
              borderBottom: isActive
                ? "2px solid #f4d03f"
                : "2px solid transparent",
              transition: "color 0.3s, border-color 0.3s",
            })}
          >
            Talk to Us
          </NavLink>
        </li>

        {!authenticated ? (
          <li>
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                color: isActive ? "#f4d03f" : "#fff",
                textDecoration: "none",
                padding: "6px 8px",
                fontWeight: 500,
                borderBottom: isActive
                  ? "2px solid #f4d03f"
                  : "2px solid transparent",
                transition: "color 0.3s, border-color 0.3s",
              })}
            >
              Login
            </NavLink>
          </li>
        ) : (
          <>
            <li>
              <NavLink
                to={`/dashboard/${role}`}
                onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  color: isActive ? "#f4d03f" : "#fff",
                  textDecoration: "none",
                  padding: "6px 8px",
                  fontWeight: 500,
                  borderBottom: isActive
                    ? "2px solid #f4d03f"
                    : "2px solid transparent",
                  transition: "color 0.3s, border-color 0.3s",
                })}
              >
                {getDashboardLabel()}
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "#274c77",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  padding: "6px 10px",
                }}
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {authenticated && <NotificationsBell />}
        {authenticated && <UserAvatar onLogout={handleLogout} />}
        <button
          onClick={() => setMenuOpen((s) => !s)}
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: "24px",
            cursor: "pointer",
            padding: "6px",
            lineHeight: 1,
            display: "none", // Hidden by default, shown on mobile
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      <style>{`
        .menu-links li { margin: 0; }
        .menu-links a.active { border-bottom: 2px solid #f4d03f; color: #f4d03f; }
        @media (max-width: 768px) {
          .menu-toggle { display: block; }
          .menu-links {
            display: ${menuOpen ? "flex" : "none"};
            flex-direction: column;
            gap: 12px;
            padding: 12px;
            position: absolute;
            top: 60px;
            left: 0;
            right: 0;
            background-color: #1b263b;
            z-index: 999;
          }
          .menu-links li { width: 100%; }
          .menu-links li a, .menu-links li button {
            display: block;
            width: 100%;
            padding: 8px 12px;
            box-sizing: border-box;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;