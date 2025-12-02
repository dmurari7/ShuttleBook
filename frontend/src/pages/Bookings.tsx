// src/pages/Bookings.tsx
import { useEffect, useState } from "react";
import { getBookings, deleteBooking, updateBooking } from "../api/bookings";
import BookingCard from "../components/BookingCard";

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    timeSlot: "",
    courtNumber: "",
    location: "",
    partnerName: "",
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await getBookings();
      console.log("API Response:", res);
      console.log("Bookings data:", res.data);
      // Backend returns { bookings: [...] }, not just [...]
      setBookings(res.data.bookings || []);
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
      await load(); // refresh
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking");
    }
  }

  function handleEditClick(id: string, booking: any) {
    setEditingBooking(booking);
    setEditForm({
      date: booking.date,
      timeSlot: booking.timeSlot,
      courtNumber: booking.courtNumber.toString(),
      location: booking.location,
      partnerName: booking.partnerName || "",
    });
  }

  function handleEditFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  async function handleUpdateSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateBooking(editingBooking._id, {
        date: editForm.date,
        timeSlot: editForm.timeSlot,
        courtNumber: Number(editForm.courtNumber),
        location: editForm.location,
        partnerName: editForm.partnerName || undefined,
      });
      setEditingBooking(null);
      await load(); // refresh
    } catch (err: any) {
      console.error("Error updating booking:", err);
      alert(err?.response?.data?.message || "Failed to update booking");
    }
  }

  function handleCancelEdit() {
    setEditingBooking(null);
  }

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
              <BookingCard 
                key={b._id} 
                booking={b} 
                onDelete={handleDelete}
                onUpdate={handleEditClick}
              />
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl border-2 border-blue-200">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent pb-2">
                Edit Booking
              </h2>

              <form onSubmit={handleUpdateSubmit} className="space-y-5">
                <label className="block">
                  <span className="font-semibold text-gray-700 text-lg">
                    Date <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditFormChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full mt-2 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none text-base"
                    required
                  />
                </label>

                <label className="block">
                  <span className="font-semibold text-gray-700 text-lg">
                    Time Slot <span className="text-red-500">*</span>
                  </span>
                  <select
                    name="timeSlot"
                    value={editForm.timeSlot}
                    onChange={handleEditFormChange}
                    className="w-full mt-2 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none text-base"
                    required
                  >
                    <option value="">Select a time</option>
                    <option>7-8 PM</option>
                    <option>8-9 PM</option>
                    <option>9-10 PM</option>
                  </select>
                </label>

                <label className="block">
                  <span className="font-semibold text-gray-700 text-lg">
                    Court Number <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="number"
                    name="courtNumber"
                    value={editForm.courtNumber}
                    onChange={handleEditFormChange}
                    min="1"
                    className="w-full mt-2 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none text-base"
                    required
                  />
                </label>

                <label className="block">
                  <span className="font-semibold text-gray-700 text-lg">
                    Location <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditFormChange}
                    placeholder="Eg. Circle K Court"
                    className="w-full mt-2 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none text-base"
                    required
                  />
                </label>

                <label className="block">
                  <span className="font-semibold text-gray-700 text-lg">
                    Partner Name <span className="text-gray-400 text-base font-normal">(optional)</span>
                  </span>
                  <input
                    type="text"
                    name="partnerName"
                    value={editForm.partnerName}
                    onChange={handleEditFormChange}
                    placeholder="Eg. Michael"
                    className="w-full mt-2 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none text-base"
                  />
                </label>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-xl text-lg font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}