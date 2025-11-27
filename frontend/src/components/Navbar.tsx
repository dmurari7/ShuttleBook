import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg px-6 py-4 flex justify-between items-center">
      <Link to="/dashboard" className="font-bold text-2xl">
        ShuttleBook
      </Link>
      <div className="space-x-4 flex items-center">
        <Link className="hover:text-blue-200 transition-colors" to="/dashboard">
          Dashboard
        </Link>
        <Link className="hover:text-blue-200 transition-colors" to="/bookings">
          Bookings
        </Link>
        <Link className="hover:text-blue-200 transition-colors" to="/bookings/create">
          Create Booking
        </Link>
        <Link className="hover:text-blue-200 transition-colors" to="/partners">
          Partner Requests
        </Link>
        <span className="px-2 py-1 rounded-lg bg-blue-800">{user?.username}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
