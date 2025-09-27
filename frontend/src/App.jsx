// App.jsx
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
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ManagerDashboard from "./pages/dashboard/ManagerDashboard";
import TechnicianDashboard from "./pages/dashboard/TechnicianDashboard";
import FinanceDashboard from "./pages/dashboard/FinanceDashboard";

// Shared module pages
import DashboardPage from "./modules/Dashboard/DashboardPage";
import HRPage from "./modules/HR/HRPage";
import TasksPage from "./modules/Tasks/TasksPage";
import TimePage from "./modules/Time/TimePage";
import NotificationsPage from "./modules/Notifications/NotificationsPage";

function AppContent() {
  const auth = useContext(AuthContext);

  useEffect(() => {
    setAuthStore(auth);
  }, [auth.token, auth.refreshToken]);

  // Role-based router for dashboards
  const DashboardRouter = () => {
    const { role } = useContext(AuthContext);
    console.log("Role in DashboardRouter:", role);

    if (role === "admin") return <AdminDashboard />;
    if (role === "manager") return <ManagerDashboard />;
    if (role === "technician") return <TechnicianDashboard />;
    if (role === "finance") return <FinanceDashboard />;

    return <Navigate to="/" replace />;
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

        {/* Role-based dashboard route */}
        <Route path="/dashboard/*" element={<DashboardRouter />}>
          {/* Shared module child routes */}
          <Route path="home" element={<DashboardPage />} />
          <Route path="hr" element={<HRPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="time" element={<TimePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
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
