import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode"; // Vite-compatible

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRefresh = localStorage.getItem("refresh_token");
    const savedRole = localStorage.getItem("role");

    if (savedToken && savedRefresh && savedRole) {
      setToken(savedToken);
      setRefreshToken(savedRefresh);
      setRole(savedRole);

      try {
        const decoded = jwt_decode(savedToken);
        setUser({
          id: decoded.user_id,
          username: decoded.username,
          role: decoded.role,
        });
      } catch (err) {
        console.error("Failed to decode saved token", err);
      }
    }
  }, []);

  const login = (accessToken, newRefreshToken, newRole) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refresh_token", newRefreshToken);
    localStorage.setItem("role", newRole);

    setToken(accessToken);
    setRefreshToken(newRefreshToken);
    setRole(newRole);

    try {
      const decoded = jwt_decode(accessToken);
      setUser({
        id: decoded.user_id,
        username: decoded.username,
        role: decoded.role,
      });
    } catch (err) {
      console.error("Failed to decode login token", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    setToken(null);
    setRefreshToken(null);
    setRole(null);
    setUser(null);
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/refresh", {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token: newRefresh } = response.data;

      if (!access_token || !newRefresh) throw new Error("Invalid refresh response");

      localStorage.setItem("token", access_token);
      localStorage.setItem("refresh_token", newRefresh);

      setToken(access_token);
      setRefreshToken(newRefresh);

      try {
        const decoded = jwt_decode(access_token);
        setUser({
          id: decoded.user_id,
          username: decoded.username,
          role: decoded.role,
        });
      } catch (err) {
        console.error("Failed to decode refreshed token", err);
      }

      return access_token;
    } catch (err) {
      console.error("Token refresh failed", err);
      logout();
      return null;
    }
  };

  const authenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        role,
        user,
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
