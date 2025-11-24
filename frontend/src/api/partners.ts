// src/api/partners.ts
import instance from "./axiosInstance";

export interface PartnerRequestData {
  toUserId: string;
  bookingId: string;
}

// Send partner request
export const sendPartnerRequest = async (data: PartnerRequestData) => {
  return instance.post("/partners/request", data);
};

// Get incoming requests
export const getIncomingRequests = async () => {
  return instance.get("/partners/incoming");
};

// Get outgoing requests
export const getOutgoingRequests = async () => {
  return instance.get("/partners/outgoing");
};

// Respond to request
export const respondToRequest = async (requestId: string, action: "accepted" | "rejected") => {
  return instance.put(`/partners/${requestId}/respond`, { action });
};
