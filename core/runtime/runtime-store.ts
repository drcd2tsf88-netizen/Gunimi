import {
  create,
} from "zustand";

import type {
  OrbitRuntimeState,

  OrbitMembership,

  OrbitRuntimeUser,

  OrbitWorkspace,
} from "./runtime-types";

type RuntimeStore =
  OrbitRuntimeState & {
    setInitialized:
      (
        value: boolean
      ) => void;

    setLoading:
      (
        value: boolean
      ) => void;

    setUser:
      (
        user:
          | OrbitRuntimeUser
          | null
      ) => void;

    setWorkspace:
      (
        workspace:
          | OrbitWorkspace
          | null
      ) => void;

    setMembership:
      (
        membership:
          | OrbitMembership
          | null
      ) => void;
  };

export const
  useOrbitRuntimeStore =
    create<RuntimeStore>(
      (set) => ({
        initialized: false,

        loading: true,

        user: null,

        workspace: null,

        membership: null,

        setInitialized:
          (
            initialized
          ) =>
            set({
              initialized,
            }),

        setLoading:
          (loading) =>
            set({
              loading,
            }),

        setUser:
          (user) =>
            set({
              user,
            }),

        setWorkspace:
          (
            workspace
          ) =>
            set({
              workspace,
            }),

        setMembership:
          (
            membership
          ) =>
            set({
              membership,
            }),
      })
    );