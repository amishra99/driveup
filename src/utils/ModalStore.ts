import { create } from "zustand";

// ✅ Define the Modal Store Type
type ModalStore = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

// ✅ Create Zustand Store with Proper Typing
export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
