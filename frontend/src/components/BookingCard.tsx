// src/components/BookingCard.tsx
interface BookingCardProps {
  booking: any;
  onDelete: (id: string) => void;
}

export default function BookingCard({ booking, onDelete }: BookingCardProps) {
  const date = new Date(booking.date).toLocaleDateString();

  return (
    <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{date}</h3>
        <p className="text-gray-600">{booking.timeSlot}</p>
        <p className="text-gray-600">Court {booking.courtNumber}</p>
        <p className="text-gray-600">Location: {booking.location}</p>
        {booking.partnerName && (
          <p className="text-gray-500 italic">Partner: {booking.partnerName}</p>
        )}
      </div>

      <button
        onClick={() => onDelete(booking._id)}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition"
      >
        Delete
      </button>
    </div>
  );
}
