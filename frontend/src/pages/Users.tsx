// src/pages/Users.tsx
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { sendPartnerRequest } from "../api/partners";
import { getBookings } from "../api/bookings";
import instance from "../api/axiosInstance";

interface User {
  _id: string;
  username: string;
  email: string;
}

export default function Users() {
  const currentUser = useAuthStore((s) => s.user);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fetch all users except self
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await instance.get("/auth/all-users");
        const data: User[] = res.data;
        console.log("All users from API:", data);
        console.log("Current user:", currentUser);
        const filtered = data.filter((u) => u._id !== currentUser?.id);
        console.log("Filtered users:", filtered);
        setUsers(filtered);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    }
    loadUsers();
  }, [currentUser]);

  // Fetch current user's bookings for selecting bookingId
  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        const res = await getBookings();
        // Handle data structure - backend returns { bookings: [...] }
        const allBookings = res.data.bookings || res.data || [];
        // Filter out bookings that already have a partner
        const availableBookings = allBookings.filter((b: any) => !b.partnerName || b.partnerName === "");
        setBookings(availableBookings);
      } catch (err) {
        console.error("Error loading bookings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  async function handleSendRequest(toUserId: string) {
    if (!selectedBookingId) {
      setStatus("Please select a booking first.");
      setTimeout(() => setStatus(""), 3000);
      return;
    }

    try {
      await sendPartnerRequest({
        toUserId,
        bookingId: selectedBookingId,
      });
      setStatus("Request sent successfully!");
      setTimeout(() => setStatus(""), 3000);
    } catch (err: any) {
      setStatus(err?.response?.data?.message || "Failed to send request");
      setTimeout(() => setStatus(""), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent pb-2">
          Find Partners
        </h1>

        {status && (
          <div className={`mb-6 rounded-xl p-4 border-2 ${
            status.includes("success") || status.includes("sent")
              ? "bg-green-50 border-green-200"
              : "bg-yellow-50 border-yellow-200"
          }`}>
            <p className={`text-center font-medium ${
              status.includes("success") || status.includes("sent")
                ? "text-green-700"
                : "text-yellow-700"
            }`}>
              {status}
            </p>
          </div>
        )}

        {/* Booking selector */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-xl border-2 border-blue-200">
          <label htmlFor="booking-select" className="font-semibold text-gray-700 text-lg block mb-3">
            Select your booking to send requests:
          </label>
          <select
            id="booking-select"
            value={selectedBookingId}
            onChange={(e) => setSelectedBookingId(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none text-base"
          >
            <option value="">-- Choose a Booking --</option>
            {bookings.map((b) => (
              <option key={b._id} value={b._id}>
                {new Date(b.date).toLocaleDateString()} - {b.timeSlot} - Court {b.courtNumber} ({b.location})
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-200 text-center">
            <p className="text-gray-600 text-lg">Loading users...</p>
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-200 text-center">
            <p className="text-gray-600 text-lg">No other users found</p>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.map((u) => (
              <div 
                key={u._id} 
                className="bg-white p-6 rounded-2xl shadow-xl border-2 border-blue-200 flex justify-between items-center hover:shadow-2xl hover:border-blue-300 transition-all"
              >
                <div>
                  <p className="font-bold text-xl text-blue-700">{u.username}</p>
                  <p className="text-gray-600 text-sm mt-1">{u.email}</p>
                </div>
                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={() => handleSendRequest(u._id)}
                >
                  Send Request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}