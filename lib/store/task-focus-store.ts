import { create } from "zustand";

type TaskFocusStore = {
  today: number;
  overdue: number;
  loaded: boolean;
  dismissed: boolean;
  setTaskCounts: (counts: { today: number; overdue: number }) => void;
  dismiss: () => void;
};

export const useTaskFocusStore = create<TaskFocusStore>((set) => ({
  today: 0,
  overdue: 0,
  loaded: false,
  dismissed: false,
  setTaskCounts: (counts) => set({ ...counts, loaded: true }),
  dismiss: () => set({ dismissed: true }),
}));
