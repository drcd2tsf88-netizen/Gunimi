"use client";

import { create }
from "zustand";

type WorkspaceStats = {
  tasks: number;

  contacts: number;

  notes: number;

  activity: number;
};

type Workspace = {
  id: string;

  name: string;

  plan?: string;

  stats?: WorkspaceStats;
};

type WorkspaceStore = {
  workspace: Workspace | null;

  setWorkspace: (
    workspace: Workspace
  ) => void;

  updateWorkspaceStats: (
    stats: WorkspaceStats
  ) => void;
};

export const useWorkspaceStore =
  create<WorkspaceStore>(
    (set) => ({
      workspace: null,

      setWorkspace: (
        workspace
      ) =>
        set({
          workspace,
        }),

      updateWorkspaceStats:
        (stats) =>
          set((state) => ({
            workspace:
              state.workspace
                ? {
                    ...state.workspace,

                    stats,
                  }
                : null,
          })),
    })
  );