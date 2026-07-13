import { create } from "zustand";

type DogfoodContext = {
  dogfoodEnabled: boolean;
  workspaceId: string | null;
  userId: string | null;
};

type DogfoodStore = DogfoodContext & {
  isOpen: boolean;
  openFeedback: () => void;
  closeFeedback: () => void;
  setContext: (ctx: DogfoodContext) => void;
};

export const useDogfoodStore = create<DogfoodStore>((set) => ({
  isOpen: false,
  dogfoodEnabled: false,
  workspaceId: null,
  userId: null,
  openFeedback: () => set({ isOpen: true }),
  closeFeedback: () => set({ isOpen: false }),
  setContext: (ctx) => set(ctx),
}));
