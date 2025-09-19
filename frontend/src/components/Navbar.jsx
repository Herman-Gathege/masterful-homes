import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // use NavLink
import { AuthContext } from "../context/AuthContext";
import NotificationsBell from "./NotificationsBell";
import logo from "../assets/logo.jpeg";
import UserAvatar from "./UserAvatar";

const Navbar = () => {
  const { authenticated, logout, role } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  const getDashboardLabel = () => {
    switch (role) {
      case "admin":
        return "Admin Panel";
      case "manager":
        return "Manager Hub";
      case "technician":
        return "Tech Center";
      case "finance":
        return "Finance Portal";
      default:
        return "Dashboard";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen((s) => !s);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      style={{
        backgroundColor: "#1b263b",
        padding: "5px 10px",
        color: "#fff",
        position: "relative",
        zIndex: 1000,
      }}
    >
      {/* top row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <NavLink
          to="/"
          onClick={closeMenu}
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
            style={{ height: "20px", marginRight: "10px" }}
          />
          <span style={{ fontWeight: "bold", fontSize: "18px" }}>
            Masterful Homes
          </span>
        </NavLink>

        {/* right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {authenticated && <NotificationsBell />} 
          {authenticated && <UserAvatar onLogout={handleLogout} />}
          <button
            onClick={toggleMenu}
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "26px",
              cursor: "pointer",
              padding: "6px",
              lineHeight: 1,
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* links */}
      <ul
        className={`menu-links ${menuOpen ? "open" : ""}`}
        style={ulBaseStyle}
      >
        <li>
          <NavLink to="/about-us" style={navLinkStyle} onClick={closeMenu}>
            Our Story
          </NavLink>
        </li>
        <li>
          <NavLink to="/services" style={navLinkStyle} onClick={closeMenu}>
            What we offer
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact-us" style={navLinkStyle} onClick={closeMenu}>
            Talk to Us
          </NavLink>
        </li>

        {!authenticated ? (
          <li>
            <NavLink to="/login" style={navLinkStyle} onClick={closeMenu}>
              Login
            </NavLink>
          </li>
        ) : (
          <>
            <li>
              <NavLink
                to={`/dashboard/${role}`}
                style={navLinkStyle}
                onClick={closeMenu}
              >
                {getDashboardLabel()}
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout} style={logoutButtonStyle}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>

      {/* styles */}
      <style>{`
        .menu-toggle { display: none; }

        .menu-links {
          display: flex;
          flex-direction: row;
          gap: 20px;
          list-style: none;
          padding: 0;
          margin-top: 10px;
          justify-content: center;
          align-items: center;
        }

        .menu-links li { margin: 0; }

        /* Active link highlight */
        .menu-links a.active {
          border-bottom: 2px solid #f4d03f;
          color: #f4d03f;
        }

        @media (max-width: 768px) {
          .menu-toggle { display: block; }

          .menu-links {
            display: none;
            flex-direction: column;
            gap: 12px;
            padding: 12px 0;
            margin-top: 8px;
            width: 100%;
          }

          .menu-links.open {
            display: flex;
          }

          .menu-links li { width: 100%; }
          .menu-links li a, .menu-links li button {
            display: inline-block;
            width: 100%;
            padding: 8px 12px;
            box-sizing: border-box;
          }
        }
      `}</style>
    </nav>
  );
};

/* Base styles */
const ulBaseStyle = {
  listStyle: "none",
  padding: 0,
  marginTop: "10px",
};

/* Active + base nav link style */
const navLinkStyle = ({ isActive }) => ({
  color: isActive ? "#f4d03f" : "#fff",
  textDecoration: "none",
  display: "inline-block",
  padding: "6px 8px",
  fontWeight: 500, // keep consistent weight
  borderBottom: isActive ? "2px solid #f4d03f" : "2px solid transparent", // reserve space
  transition: "color 0.3s, border-color 0.3s", // smooth highlight
});

const logoutButtonStyle = {
  backgroundColor: "#274c77",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  padding: "6px 10px",
};

export default Navbar;
