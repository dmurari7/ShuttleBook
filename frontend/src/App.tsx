import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import CreateBooking from "./pages/CreateBooking";
import PartnerRequests from "./pages/PartnerRequests";
import Users from "./pages/Users";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <Dashboard />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <Bookings />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/create"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <CreateBooking />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/partners"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <PartnerRequests />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <div>
                <Navbar />
                <Users />
              </div>
            </ProtectedRoute>
          }
        />
        {/* Catch-all redirect */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}
