// store.ts
import create from 'zustand';

interface dropdownLesson04 {
  isOpen04: boolean;
  toggleOpen04: () => void;
  close04: () => void;
}

const usedropdown04 = create<dropdownLesson04>((set) => ({
  isOpen04: false,
  toggleOpen04: () => set((state) => ({ isOpen04: !state.isOpen04 })),
  close04: () => set({ isOpen04: false }),
}));

export default usedropdown04 ;
