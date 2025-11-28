// src/api/bookings.ts
import instance from "./axiosInstance";

export interface BookingData {
  courtNumber: number;
  location: string;
  date: string;
  timeSlot: string;
  partnerName?: string;
}

export const createBooking = async (data: BookingData) => {
  return instance.post("/bookings", data);
};

export const getBookings = async () => {
  return instance.get("/bookings", {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
};

export const updateBooking = async (id: string, data: Partial<BookingData>) => {
  return instance.put(`/bookings/${id}`, data);  
};

export const deleteBooking = async (id: string) => {
  return instance.delete(`/bookings/${id}`); 
};