// store.ts
import create from 'zustand';

interface Store {
  isOpenright: boolean;
  toggleOpenright: () => void;
  closeright: () => void;
}

const useStoreright = create<Store>((set) => ({
  isOpenright: false,
  toggleOpenright: () => set((state) => ({ isOpenright: !state.isOpenright })),
  closeright: () => set({ isOpenright: false }),
}));

export default useStoreright;
