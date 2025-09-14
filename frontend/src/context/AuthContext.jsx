// AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRefresh = localStorage.getItem("refresh_token");
    const savedRole = localStorage.getItem("role");

    if (savedToken && savedRefresh && savedRole) {
      setToken(savedToken);
      setRefreshToken(savedRefresh);
      setRole(savedRole);
    }
  }, []);

  const login = (newToken, newRefreshToken, newRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("refresh_token", newRefreshToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    setRole(newRole);
  };

  
  

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRefreshToken(null);
    setRole(null);
  };

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

      return access_token;
    } catch (err) {
      console.error("Refresh token failed", err);
      logout(); // Optionally auto-logout
    }
  };

  const authenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, refreshToken, role, authenticated, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
