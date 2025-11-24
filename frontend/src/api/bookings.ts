// src/api/bookings.ts
import instance from "./axiosInstance";

export interface BookingData {
  courtNumber: number;
  location: string;
  date: string; // ISO string YYYY-MM-DD
  timeSlot: string; // e.g., "7-8 PM"
  partnerName?: string;
}

// Create a booking
export const createBooking = async (data: BookingData) => {
  return instance.post("/bookings", data);
};

// Get all bookings for logged-in user
export const getBookings = async () => {
  return instance.get("/bookings");
};

// Update a booking
export const updateBooking = async (id: string, data: Partial<BookingData>) => {
  return instance.put(`/bookings/${id}`, data);
};

// Delete a booking
export const deleteBooking = async (id: string) => {
  return instance.delete(`/bookings/${id}`);
};
