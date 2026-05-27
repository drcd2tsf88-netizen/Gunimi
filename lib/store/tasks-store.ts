import { create } from "zustand";

type Task = {
  id: string;

  title: string;

  status: string;

  priority: string;

  created_at: string;
};

type TasksStore = {
  tasks: Task[];

  setTasks: (
    tasks: Task[]
  ) => void;

  addTask: (
    task: Task
  ) => void;
};

export const useTasksStore =
  create<TasksStore>((set) => ({
    tasks: [],

    setTasks: (tasks) =>
      set({
        tasks,
      }),

    addTask: (task) =>
      set((state) => ({
        tasks: [
          task,
          ...state.tasks,
        ],
      })),
  }));