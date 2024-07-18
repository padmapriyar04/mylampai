// store.ts
import create from "zustand";

interface ModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  setIsOpen: (value: boolean) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  setIsOpen: (value: boolean) => set({ isOpen: value }),
}));

interface BooleanStore {
  booleanValue: boolean;
  setBooleanValue: (value: boolean) => void;
}

export const useBooleanStore = create<BooleanStore>((set) => ({
  booleanValue: false,
  setBooleanValue: (value) => set({ booleanValue: value }),
}));
