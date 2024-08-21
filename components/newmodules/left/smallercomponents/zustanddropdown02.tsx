// store.ts
import { create } from "zustand";

interface dropdownLesson {
  isOpen: boolean;
  toggleOpen: () => void;
  close: () => void;
}

const usedropdown = create<dropdownLesson>((set) => ({
  isOpen: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}));

export default usedropdown;
