// Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NotificationsBell from "./NotificationsBell";
import SearchBar from "./SearchBar";
import logo from "../assets/logo-icon.jpeg";
import UserAvatar from "./UserAvatar";
import "../css/Navbar.css"; // 👈 add a css file for responsiveness

const Navbar = () => {
  const { authenticated, logout, role } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboardView = location.pathname.startsWith("/dashboard");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };
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
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-left">
        <NavLink to="/" onClick={() => setMenuOpen(false)} className="logo">
          <img src={logo} alt="DashWise" />
          <span>DashWise</span>
        </NavLink>
      </div>

      {/* Center: Links or Search */}
      <div className="navbar-center">
        {authenticated && isDashboardView ? (
          <div className="search-container">
            <SearchBar />
          </div>
        ) : (
          <ul className={`menu-links ${menuOpen ? "open" : ""}`}>
            <li>
              <NavLink to="/about-us" onClick={() => setMenuOpen(false)}>
                Our Story
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" onClick={() => setMenuOpen(false)}>
                What we offer
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact-us" onClick={() => setMenuOpen(false)}>
                Talk to Us
              </NavLink>
            </li>
          </ul>
        )}
      </div>

      {/* Right: Auth / Notifications / Avatar / Hamburger */}
      <div className="navbar-right">
        {authenticated && <NotificationsBell />}
        {authenticated && <UserAvatar onLogout={handleLogout} />}

        {!authenticated && (
          <NavLink to="/signup" className="signup-btn desktop-only">
            Get Started
          </NavLink>
        )}

        {/* Hamburger toggle */}
        <button
          onClick={() => setMenuOpen((s) => !s)}
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <ul className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {authenticated && isDashboardView ? (
          <>
            <li>
              <SearchBar />
            </li>
            <li>
              <NavLink
                to={`/dashboard/${role}`}
                onClick={() => setMenuOpen(false)}
              >
                {getDashboardLabel()}
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/about-us" onClick={() => setMenuOpen(false)}>
                Our Story
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" onClick={() => setMenuOpen(false)}>
                What we offer
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact-us" onClick={() => setMenuOpen(false)}>
                Talk to Us
              </NavLink>
            </li>
            {!authenticated && (
              <li>
                <NavLink
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="signup-btn"
                >
                  Get Started
                </NavLink>
              </li>
            )}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
