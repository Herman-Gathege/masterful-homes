// src/App.jsx
import { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { setAuthStore } from "./context/axiosInstance";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";

import UserRegistrationForm from "./components/UserRegistrationForm";

// NEW: imports for modular dashboards
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./modules/Dashboard";
import HR from "./modules/HR";
import Tasks from "./modules/Tasks";
import Time from "./modules/Time";
import Notifications from "./modules/Notifications";

function AppContent() {
  const auth = useContext(AuthContext);

  useEffect(() => {
    setAuthStore(auth);
  }, [auth]);

  const handleLogout = () => {
    console.log("Logout clicked");
    // TODO: clear auth + redirect to login
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/register" element={<UserRegistrationForm />} />

        {/* Modular Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout onLogout={handleLogout} />}>
          <Route index element={<Dashboard />} />
          <Route path="hr" element={<HR />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="time" element={<Time />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
