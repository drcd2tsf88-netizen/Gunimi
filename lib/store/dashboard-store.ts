import { create }
from "zustand";

type DashboardStore = {
  totalTasks: number;

  completedTasks: number;

  activeTasks: number;

  totalActivity: number;

  setMetrics: (
    metrics: {
      totalTasks: number;

      completedTasks: number;

      activeTasks: number;

      totalActivity: number;
    }
  ) => void;
};

export const useDashboardStore =
  create<DashboardStore>(
    (set) => ({
      totalTasks: 0,

      completedTasks: 0,

      activeTasks: 0,

      totalActivity: 0,

      setMetrics: (
        metrics
      ) =>
        set(metrics),
    })
  );