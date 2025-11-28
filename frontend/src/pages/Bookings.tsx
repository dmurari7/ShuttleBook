// src/pages/Bookings.tsx
import { useEffect, useState } from "react";
import { getBookings, deleteBooking } from "../api/bookings";

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await getBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }
    try {
      await deleteBooking(id);
      load(); // refresh
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking");
    }
  }

  console.log("Bookings state:", { loading, error, bookingsCount: bookings.length, bookings });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent pb-2">
          Your Bookings
        </h1>

        {loading && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-200 text-center">
            <p className="text-gray-600 text-lg">Loading bookings...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 rounded-3xl shadow-xl p-8 border-2 border-red-200 text-center">
            <p className="text-red-600 text-lg">{error}</p>
            <button 
              onClick={load}
              className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-200 text-center">
            <p className="text-gray-600 text-lg">You have no bookings yet.</p>
            <p className="text-gray-500 mt-2">Create a booking to get started!</p>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white shadow-xl rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-blue-700 mb-2">
                  {new Date(b.date).toLocaleDateString()}
                </h3>
                <p className="text-gray-700 text-lg">{b.timeSlot}</p>
                <p className="text-gray-700 text-lg">Court {b.courtNumber}</p>
                <p className="text-gray-700 text-lg">Location: {b.location}</p>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="mt-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}