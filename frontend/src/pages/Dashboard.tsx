// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { getBookings } from "../api/bookings";

export default function Dashboard() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await getBookings();
      const sorted = res.data.sort(
        (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setBookings(sorted);
    } catch (err) {
      console.error(err);
    }
  }

  const nextBooking = bookings[0];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Dashboard</h1>

      {!nextBooking && (
        <p className="text-gray-600">You have no upcoming bookings.</p>
      )}

      {nextBooking && (
        <div className="bg-blue-100 border border-blue-300 rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Next Booking</h2>
          <p className="text-blue-700 text-lg">
            {new Date(nextBooking.date).toLocaleDateString()}
          </p>
          <p className="text-blue-600">{nextBooking.timeSlot}</p>
          <p className="text-blue-600">Court {nextBooking.courtNumber}</p>
          <p className="text-blue-600">Location: {nextBooking.location}</p>
          {nextBooking.partnerName && (
            <p className="text-blue-500 italic">
              Partner: {nextBooking.partnerName}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

