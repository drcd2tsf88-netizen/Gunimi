import { create }
from "zustand";

type OrbitCommandStore = {
  open: boolean;

  setOpen: (
    open: boolean
  ) => void;
};

export const useOrbitCommandStore =
  create<OrbitCommandStore>(
    (set) => ({
      open: false,

      setOpen: (
        open
      ) =>
        set({
          open,
        }),
    })
  );