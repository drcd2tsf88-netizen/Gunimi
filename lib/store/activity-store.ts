import { create }
from "zustand";

type Activity = {
  id: string;

  type: string;

  title: string;

  description: string;

  created_at: string;
};

type ActivityStore = {
  activity: Activity[];

  setActivity: (
    activity: Activity[]
  ) => void;
};

export const useActivityStore =
  create<ActivityStore>(
    (set) => ({
      activity: [],

      setActivity: (
        activity
      ) =>
        set({
          activity,
        }),
    })
  );