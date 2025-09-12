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

function AppContent() {
  const auth = useContext(AuthContext);

  useEffect(() => {
    setAuthStore(auth);
  }, [auth.token, auth.refreshToken]);

  const DashboardRouter = () => {
    const { role } = useContext(AuthContext);
    console.log("Role in DashboardRouter:", role);

    if (role === "admin") return <AdminDashboard />;
    if (role === "manager") return <ManagerDashboard />;
    if (role === "technician") return <TechnicianDashboard />;
    if (role === "finance") return <FinanceDashboard />;

    return <Navigate to="/" />;
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />

        <Route path="/register" element={<UserRegistrationForm />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/dashboard/manager" element={<ManagerDashboard />} />
        <Route path="/dashboard/technician" element={<TechnicianDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/finance" element={<FinanceDashboard />} />
      </Routes>
      {/* <Footer /> */}
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
