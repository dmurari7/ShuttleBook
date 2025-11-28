// src/components/BookingCard.tsx
interface BookingCardProps {
  booking: any;
  onDelete: (id: string) => void;
}

export default function BookingCard({ booking, onDelete }: BookingCardProps) {
  const date = new Date(booking.date).toLocaleDateString();

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border-2 border-blue-200 flex justify-between items-center hover:shadow-2xl hover:border-blue-300 transition-all duration-200 relative overflow-hidden group">
      {/* Decorative gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-blue-700 mb-2">{date}</h3>
        <p className="text-gray-700 text-lg font-medium">{booking.timeSlot}</p>
        <p className="text-gray-700 text-lg font-medium">Court {booking.courtNumber}</p>
        <p className="text-gray-700 text-lg font-medium">Location: {booking.location}</p>
        {booking.partnerName && (
          <div className="mt-3 pt-3 border-t-2 border-blue-100">
            <p className="text-blue-600 font-medium text-lg">Partner: {booking.partnerName}</p>
          </div>
        )}
      </div>

      <button
        onClick={() => onDelete(booking._id)}
        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 relative z-10"
      >
        Delete
      </button>
    </div>
  );
}