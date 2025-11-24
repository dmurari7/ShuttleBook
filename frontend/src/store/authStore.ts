// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as apiLogin, signup as apiSignup, getMe as apiGetMe } from "../api/auth";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const response = await apiLogin({ email, password });
          const { token, user } = response.data;
          localStorage.setItem("token", token); // Persist token
          set({ user, token, loading: false });
        } catch (err: any) {
          set({ error: err.response?.data?.message || err.message, loading: false });
        }
      },

      signup: async (username, email, password) => {
        try {
          set({ loading: true, error: null });
          const response = await apiSignup({ username, email, password });
          const { token, user } = response.data;
          localStorage.setItem("token", token); // Persist token
          set({ user, token, loading: false });
        } catch (err: any) {
          set({ error: err.response?.data?.message || err.message, loading: false });
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
      },

      fetchMe: async () => {
        try {
          set({ loading: true, error: null });
          const response = await apiGetMe();
          set({ user: response.data.user, loading: false });
        } catch (err: any) {
          set({ error: err.response?.data?.message || err.message, loading: false });
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
);
