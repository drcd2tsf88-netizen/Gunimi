import { create } from "zustand";

type OrbitCommandStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

export const useOrbitCommandStore = create<OrbitCommandStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  // Reads current state atomically — no stale closure in keyboard handlers
  toggle: () => set((state) => ({ open: !state.open })),
}));
