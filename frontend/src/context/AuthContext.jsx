// AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  // 🔄 Load saved auth data from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRefresh = localStorage.getItem("refresh_token");
    const savedRole = localStorage.getItem("role");

    if (savedToken && savedRefresh && savedRole) {
      setToken(savedToken);
      setRefreshToken(savedRefresh);
      setRole(savedRole);

      try {
        const decoded = jwtDecode(savedToken);
        setUser({
          id: decoded.id,
          username: decoded.username,
          role: decoded.role,
        });
      } catch (err) {
        console.error("Failed to decode saved token", err);
      }
    }
  }, []);

  // 🟢 Login and save user info
  const login = (newToken, newRefreshToken, newRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("refresh_token", newRefreshToken);
    localStorage.setItem("role", newRole);

    setToken(newToken);
    setRefreshToken(newRefreshToken);
    setRole(newRole);

    try {
      const decoded = jwtDecode(newToken);
      setUser({
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      });
    } catch (err) {
      console.error("Failed to decode login token", err);
    }
  };

  // 🔴 Logout clears everything
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRefreshToken(null);
    setRole(null);
    setUser(null);
  };

  // 🔁 Refresh access token
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/refresh", {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      setToken(access_token);
      setRefreshToken(refresh_token);

      try {
        const decoded = jwtDecode(access_token);
        setUser({
          id: decoded.id,
          username: decoded.username,
          role: decoded.role,
        });
      } catch (err) {
        console.error("Failed to decode refreshed token", err);
      }

      return access_token;
    } catch (err) {
      console.error("Refresh token failed", err);
      logout();
    }
  };

  const authenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        role,
        user,              // 👈 now exposed
        authenticated,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

