// src/api/auth.ts
import instance from "./axiosInstance";

// Signup
export const signup = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  return instance.post("/auth/signup", data);
};

// Login
export const login = async (data: { email: string; password: string }) => {
  return instance.post("/auth/login", data);
};

// Get current user
export const getMe = async () => {
  return instance.get("/auth/me");
};
