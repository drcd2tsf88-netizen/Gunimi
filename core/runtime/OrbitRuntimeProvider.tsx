"use client";

import {
  createContext,
  useContext,
  useEffect,
} from "react";

import {
  supabase,
} from "@/lib/supabase";

import {
  useOrbitRuntimeStore,
} from "./runtime-store";

import {
  emitEvent,
} from "./runtime-events";

type RuntimeContextType =
{
  initialized: boolean;

  loading: boolean;
};

const OrbitRuntimeContext =
  createContext<
    RuntimeContextType | null
  >(null);

export function
OrbitRuntimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    initialized,
    loading,

    setInitialized,
    setLoading,

    setUser,
    setWorkspace,
    setMembership,
  } =
    useOrbitRuntimeStore();

  useEffect(() => {
    async function initializeRuntime() {
      try {
        setLoading(true);

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          setInitialized(true);
          return;
        }

        const {
          data: profile,
        } =
          await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            platform_role: profile.platform_role,
          });
        }

        const {
          data: membership,
        } =
          await supabase
            .from("workspace_members")
            .select(`
              *,
              workspaces (
                id,
                name,
                slug
              )
            `)
            .eq("user_id", user.id)
            .maybeSingle();

        if (membership) {
          setMembership({
            id: membership.id,
            role: membership.role,
            workspace_id: membership.workspace_id,
          });

          if (membership.workspaces) {
            setWorkspace({
              id: membership.workspaces.id,
              name: membership.workspaces.name,
              slug: membership.workspaces.slug,
            });
          }
        }

        emitEvent("runtime.initialized", { user, membership });
        setInitialized(true);
        setLoading(false);
      } catch {
        setLoading(false);
        setInitialized(true);
      }
    }

    void initializeRuntime();

    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        (
          event,
          session
        ) => {
          emitEvent(
            "auth.changed",
            {
              event,
              session,
            }
          );
        }
      );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setInitialized, setLoading, setMembership, setUser, setWorkspace]);

  return (
    <OrbitRuntimeContext.Provider
      value={{
        initialized,

        loading,
      }}
    >
      {children}
    </OrbitRuntimeContext.Provider>
  );
}

export function
useOrbitRuntime() {
  const context =
    useContext(
      OrbitRuntimeContext
    );

  if (!context) {
    throw new Error(
      "useOrbitRuntime must be used inside OrbitRuntimeProvider"
    );
  }

  return context;
}