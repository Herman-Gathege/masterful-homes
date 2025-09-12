import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";

function Footer() {
  return (
    <div>
      {" "}
      {/* Footer */}
      <footer
        style={{
          padding: "2rem",
          backgroundColor: "#1b263b",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Link
          to="/"
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
            style={{ height: "40px", marginRight: "10px" }}
          />
          <span style={{ fontWeight: "bold", fontSize: "18px" }}>
            Masterful Homes
          </span>
        </Link>
        <p>
          &copy; {new Date().getFullYear()} Masterful Homes. All rights
          reserved.
        </p>
        <p>Built for growth, designed for impact.</p>
      </footer>
    </div>
  );
}

export default Footer;
