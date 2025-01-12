import { create } from "zustand";
import { persist } from "zustand/middleware";

type RoleStoreState = { role: "user" | "recruiter" | null };

type RoleStoreActions = {
  setRole: (
    newRole:
      | RoleStoreState["role"]
      | ((currentRole: RoleStoreState["role"]) => RoleStoreState["role"])
  ) => void;
};

type RoleStore = RoleStoreState & RoleStoreActions;

export const useRoleStore = create<RoleStore>()(
  persist(
    (set) => ({
      role: null,
      setRole: (newRole) => {
        set((state) => ({
          role: typeof newRole === "function" ? newRole(state.role) : newRole,
        }));
      },
    }),
    {
      name: "role-store",
    }
  )
);
