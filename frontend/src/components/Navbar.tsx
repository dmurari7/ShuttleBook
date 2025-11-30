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
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-2xl px-8 py-5 flex justify-between items-center border-b-4 border-blue-800 sticky top-0 z-50">
      <Link to="/dashboard" className="font-bold text-4xl hover:scale-105 transition-transform duration-200 tracking-wide" style={{ fontFamily: "'Fredoka One', 'Arial Black', sans-serif" }}>
        ShuttleBook
      </Link>
      <div className="space-x-6 flex items-center">
        <Link className="px-3 py-2 rounded-lg font-semibold transition-all hover:bg-blue-800" style={{ color: 'white' }} to="/bookings">
          Bookings
        </Link>
        <Link className="px-3 py-2 rounded-lg font-semibold transition-all hover:bg-blue-800" style={{ color: 'white' }} to="/bookings/create">
          Create Booking
        </Link>
        <Link className="px-3 py-2 rounded-lg font-semibold transition-all hover:bg-blue-800" style={{ color: 'white' }} to="/users">
          Find Partners
        </Link>
        <Link className="px-3 py-2 rounded-lg font-semibold transition-all hover:bg-blue-800" style={{ color: 'white' }} to="/partners">
          Partner Requests
        </Link>
        <span className="px-4 py-2 rounded-xl bg-blue-800 font-bold shadow-lg border-2 border-blue-900 text-white">{user?.username}</span>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-5 py-2 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}