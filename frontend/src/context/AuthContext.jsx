// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  // load from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRefresh = localStorage.getItem("refresh_token");
    const savedRole = localStorage.getItem("role");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedRefresh) {
      setToken(savedToken);
      setRefreshToken(savedRefresh);
      setRole(savedRole || null);

      try {
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          const decoded = jwt_decode(savedToken);
          setUser({
            id: decoded.sub, // user id comes from "sub"
            username: decoded.username || decoded.email,
            role: decoded.role,
            email: decoded.email,
            tenant_id: decoded.tenant_id,
          });
        }
      } catch (err) {
        console.error("Failed to decode saved token", err);
      }
    }
  }, []);

  // login: centralize persisting tokens + user
  const login = (accessToken, newRefreshToken, userObj) => {
    if (!accessToken || !newRefreshToken) return;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("refresh_token", newRefreshToken);
    if (userObj?.role) localStorage.setItem("role", userObj.role);
    if (userObj) localStorage.setItem("user", JSON.stringify(userObj));

    setToken(accessToken);
    setRefreshToken(newRefreshToken);
    setRole(userObj?.role || null);
    setUser(userObj || null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setToken(null);
    setRefreshToken(null);
    setRole(null);
    setUser(null);
  };

  // Refresh access token using the refresh token (sent in Authorization header)
  const refreshAccessToken = async () => {
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/auth/refresh",
        {},
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );

      const { access_token, refresh_token: newRefresh } = response.data;
      if (!access_token || !newRefresh) throw new Error("Invalid refresh response");

      localStorage.setItem("token", access_token);
      localStorage.setItem("refresh_token", newRefresh);

      setToken(access_token);
      setRefreshToken(newRefresh);

      try {
        const decoded = jwt_decode(access_token);
        setUser((prev) => ({
          ...(prev || {}),
          id: decoded.sub || prev?.id,
          username: decoded.username || prev?.username,
          role: decoded.role || prev?.role,
          email: decoded.email || prev?.email,
          tenant_id: decoded.tenant_id || prev?.tenant_id,
        }));
      } catch (err) {
        // ignore decode errors
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
