// store.ts
import { create } from 'zustand';

interface BooleanState {
  booleanValue: boolean;
  setBooleanValue: (value: boolean) => void;
}

const useBooleanStore = create<BooleanState>((set) => ({
  booleanValue: false,
  setBooleanValue: (value) => set({ booleanValue: value }),
}));

export default useBooleanStore;
