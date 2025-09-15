


// context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  // Load auth data from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRefresh = localStorage.getItem("refresh_token");
    const savedRole = localStorage.getItem("role");

    if (savedToken && savedRefresh && savedRole) {
      applyAuth(savedToken, savedRefresh, savedRole);
    }
  }, []);

  // Apply token + decode user
  const applyAuth = (accessToken, refreshTokenValue, userRole) => {
    setToken(accessToken);
    setRefreshToken(refreshTokenValue);
    setRole(userRole);

    localStorage.setItem("token", accessToken);
    localStorage.setItem("refresh_token", refreshTokenValue);
    localStorage.setItem("role", userRole);

    try {
      const decoded = jwtDecode(accessToken);
      setUser({
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      });
    } catch (err) {
      console.error("Failed to decode token", err);
    }
  };

  const login = (accessToken, refreshTokenValue, userRole) => {
    applyAuth(accessToken, refreshTokenValue, userRole);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRefreshToken(null);
    setRole(null);
    setUser(null);
  };

  const refreshAccessToken = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/refresh", {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token } = res.data;
      applyAuth(access_token, refresh_token, role);
      return access_token;
    } catch (err) {
      console.error("Token refresh failed", err);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        role,
        user,
        authenticated: !!token,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
