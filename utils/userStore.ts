import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role: "user" | "recruiter";
}

interface UserState {
  userData: User | null;
  token: string | null;
  setUserData: (userData: User | null, token: string | null) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userData: null,
      token: null,
      setUserData: (userData, token) => set({ userData, token }),
      clearUser: () => set({ userData: null, token: null }),
    }),
    {
      name: "user-storage",
    },
  ),
);

export { useUserStore };