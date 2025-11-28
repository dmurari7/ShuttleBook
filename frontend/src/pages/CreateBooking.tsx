// src/pages/CreateBooking.tsx
import { useState } from "react";
import { createBooking } from "../api/bookings";
import { useNavigate } from "react-router-dom";

export default function CreateBooking() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date: "",
    timeSlot: "",
    courtNumber: "",
    location: "",
    partnerName: "",
  });
  const [error, setError] = useState("");

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.date || !form.timeSlot || !form.courtNumber || !form.location) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      await createBooking({
        date: form.date,
        timeSlot: form.timeSlot,
        courtNumber: Number(form.courtNumber),
        location: form.location,
        partnerName: form.partnerName || undefined,
      });
      navigate("/bookings");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create booking.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center items-start p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl p-10 border-2 border-blue-200 w-full max-w-2xl mt-8"
      >
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent pb-2">
          Create a Booking
        </h1>

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-center font-medium">{error}</p>
          </div>
        )}

        {/* Date */}
        <label className="block mb-5">
          <span className="font-semibold text-gray-700 text-lg">
            Date <span className="text-red-500">*</span>
          </span>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={update}
            className="w-full mt-2 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none text-base"
          />
        </label>

        {/* Time Slot */}
        <label className="block mb-5">
          <span className="font-semibold text-gray-700 text-lg">
            Time Slot <span className="text-red-500">*</span>
          </span>
          <select
            name="timeSlot"
            value={form.timeSlot}
            onChange={update}
            className="w-full mt-2 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none text-base"
          >
            <option value="">Select a time</option>
            <option>5-6 AM</option>
            <option>6-7 AM</option>
            <option>7-8 AM</option>
            <option>8-9 AM</option>
            <option>9-10 AM</option>
            <option>10-11 AM</option>
            <option>11-12 PM</option>
            <option>1-2 PM</option>
            <option>2-3 PM</option>
            <option>3-4 PM</option>
            <option>4-5 PM</option>
            <option>5-6 PM</option>
            <option>6-7 PM</option>
            <option>7-8 PM</option>
            <option>8-9 PM</option>
            <option>9-10 PM</option>
          </select>
        </label>

        {/* Court # */}
        <label className="block mb-5">
          <span className="font-semibold text-gray-700 text-lg">
            Court Number <span className="text-red-500">*</span>
          </span>
          <input
            type="number"
            name="courtNumber"
            value={form.courtNumber}
            onChange={update}
            className="w-full mt-2 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none text-base"
          />
        </label>

        {/* Location */}
        <label className="block mb-5">
          <span className="font-semibold text-gray-700 text-lg">
            Location <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={update}
            placeholder="Eg. Circle K Court"
            className="w-full mt-2 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none text-base"
          />
        </label>

        {/* Partner Name */}
        <label className="block mb-6">
          <span className="font-semibold text-gray-700 text-lg">
            Partner Name <span className="text-gray-400 text-base font-normal">(optional)</span>
          </span>
          <input
            type="text"
            name="partnerName"
            value={form.partnerName}
            onChange={update}
            placeholder="Eg. Michael"
            className="w-full mt-2 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none text-base"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Create Booking
        </button>
      </form>
    </div>
  );
}