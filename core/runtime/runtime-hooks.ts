import {
  useOrbitRuntimeStore,
} from "./runtime-store";

export function
useOrbitUser() {
  return useOrbitRuntimeStore(
    (state) => state.user
  );
}

export function
useOrbitWorkspace() {
  return useOrbitRuntimeStore(
    (state) => state.workspace
  );
}

export function
useOrbitMembership() {
  return useOrbitRuntimeStore(
    (state) => state.membership
  );
}

export function
useOrbitLoading() {
  return useOrbitRuntimeStore(
    (state) => state.loading
  );
}

export function
useOrbitInitialized() {
  return useOrbitRuntimeStore(
    (state) =>
      state.initialized
  );
}