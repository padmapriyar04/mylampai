import { create } from "zustand";

type BearState = {
  bears: boolean;
  changeRoute: (val: boolean) => void;
};

// Create the Zustand store
const useRouterStore = create<BearState>((set) => ({
  bears: true,
  changeRoute: (val) => set({ bears: val })
}));

export default useRouterStore;
