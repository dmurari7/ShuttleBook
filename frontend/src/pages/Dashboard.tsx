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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Dashboard
        </h1>

        {!nextBooking && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-200 text-center">
            <p className="text-gray-600 text-lg">You have no upcoming bookings.</p>
            <p className="text-gray-500 mt-2">Book a court to get started!</p>
          </div>
        )}

        {nextBooking && (
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-2xl p-8 border-2 border-blue-800 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400 rounded-full -mr-20 -mt-20 opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600 rounded-full -ml-16 -mb-16 opacity-30"></div>
            
            <h2 className="text-3xl font-bold text-white mb-6 relative z-10">Next Booking</h2>
            <div className="space-y-3 relative z-10">
              <p className="text-white text-2xl font-semibold">
                {new Date(nextBooking.date).toLocaleDateString()}
              </p>
              <p className="text-blue-100 text-xl font-medium">{nextBooking.timeSlot}</p>
              <p className="text-blue-100 text-xl font-medium">Court {nextBooking.courtNumber}</p>
              <p className="text-blue-100 text-xl font-medium">Location: {nextBooking.location}</p>
              {nextBooking.partnerName && (
                <div className="mt-4 pt-4 border-t-2 border-blue-400">
                  <p className="text-blue-50 text-lg font-medium">
                    Partner: {nextBooking.partnerName}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}