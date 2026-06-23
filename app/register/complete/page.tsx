"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  Brain,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

import toast
from "react-hot-toast";

import { supabase }
from "@/lib/supabase";

import type { User }
from "@supabase/supabase-js";

export default function RegisterCompletePage() {
  const hasStarted =
    useRef(false);

  const [
    status,

    setStatus,
  ] = useState(
    "Initializing Orbit..."
  );

  const [
    loading,

    setLoading,
  ] = useState(true);

  // ─────────────────────────────────
  // Core setup — runs once we know
  // the authenticated user object.
  // ─────────────────────────────────

  async function completeRegistration(
    user: User
  ) {
    try {

      // PROFILE ─────────────────────

      setStatus(
        "Synchronizing identity systems..."
      );

      // Check if profile already exists so we don't overwrite
      // a role that an admin may have pre-assigned.
      const {
        data: existingProfile,
      } =
        await supabase
          .from("profiles")
          .select("id, platform_role")
          .eq("id", user.id)
          .maybeSingle();

      let profileError: unknown = null;
      let profile: { platform_role: string } | null = existingProfile;

      if (existingProfile) {
        // Profile exists — only update safe fields, preserve platform_role.
        const { error } =
          await supabase
            .from("profiles")
            .update({
              email: user.email,

              full_name:
                user.user_metadata?.full_name || "",

              avatar_url:
                user.user_metadata?.avatar_url || "",

              onboarding_completed: true,
            })
            .eq("id", user.id);

        profileError = error;
      } else {
        // New user — insert with default role.
        const { data: newProfile, error } =
          await supabase
            .from("profiles")
            .insert({
              id: user.id,

              email: user.email,

              full_name:
                user.user_metadata?.full_name || "",

              avatar_url:
                user.user_metadata?.avatar_url || "",

              onboarding_completed: true,

              platform_role: "user",

              status: "active",
            })
            .select()
            .single();

        profileError = error;
        profile = newProfile;
      }


      if (profileError) {
        console.error(
          "PROFILE UPSERT FAILED",
          profileError
        );

        toast.error(
          "Failed to initialize profile."
        );

        setLoading(false);

        return;
      }

      // EXISTING MEMBERSHIP ─────────

      setStatus(
        "Checking workspace systems..."
      );

      const {
        data:
          existingMembership,

        error:
          membershipCheckError,
      } =
        await supabase
          .from(
            "workspace_members"
          )
          .select(`
            id,
            role,
            workspace_id
          `)
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

      console.log(
        "EXISTING MEMBERSHIP",
        existingMembership,
        membershipCheckError
      );

      if (membershipCheckError) {
        toast.error(
          "Failed to check workspace membership."
        );

        setLoading(false);

        return;
      }

      // CREATE WORKSPACE ────────────

      if (!existingMembership) {
        setStatus(
          "Initializing workspace infrastructure..."
        );

        const workspaceSlug =
          `orbit-${user.id.slice(
            0,
            8
          )}`;

        // Check if workspace slug
        // already exists (e.g. retry).

        const {
          data:
            existingWorkspace,
        } =
          await supabase
            .from("workspaces")
            .select("*")
            .eq("slug", workspaceSlug)
            .limit(1)
            .maybeSingle();

        let workspace =
          existingWorkspace;

        if (!workspace) {
          const {
            data: newWorkspace,

            error:
              workspaceError,
          } =
            await supabase
              .from("workspaces")
              .insert({
                name:
                  "Orbit Workspace",

                slug:
                  workspaceSlug,
              })
              .select()
              .single();

          console.log(
            "WORKSPACE",
            newWorkspace,
            workspaceError
          );

          if (
            workspaceError ||
            !newWorkspace
          ) {
            toast.error(
              "Failed to initialize workspace."
            );

            setLoading(false);

            return;
          }

          workspace = newWorkspace;
        }

        // MEMBERSHIP ──────────────

        const {
          data: membership,

          error:
            membershipError,
        } =
          await supabase
            .from(
              "workspace_members"
            )
            .insert({
              workspace_id:
                workspace.id,

              user_id: user.id,

              role: "owner",
            })
            .select()
            .single();

        console.log(
          "MEMBERSHIP",
          membership,
          membershipError
        );

        if (membershipError) {
          toast.error(
            "Failed to initialize membership."
          );

          setLoading(false);

          return;
        }
      }

      // INVITE REDIRECT ─────────────

      const inviteToken =
        localStorage.getItem(
          "orbit_invite_token"
        );

      if (inviteToken) {
        localStorage.removeItem(
          "orbit_invite_token"
        );

        window.location.href =
          `/invite/${inviteToken}`;

        return;
      }

      // DONE ────────────────────────

      setStatus(
        "Orbit systems synchronized."
      );

      toast.success(
        "Orbit initialized successfully."
      );

      setLoading(false);

      const role = profile?.platform_role || "user";
      const hasAccess =
        role === "beta" ||
        role === "team" ||
        role === "admin";

      setTimeout(() => {
        window.location.href =
          hasAccess ? "/dashboard" : "/waitlist";
      }, 1200);
    } catch (err) {
      console.error(
        "REGISTER COMPLETE CRASH",
        err
      );

      toast.error(
        "Orbit initialization failed."
      );

      setLoading(false);
    }
  }

  // ─────────────────────────────────
  // Wait for Supabase to finish
  // processing the email-link token
  // before doing anything.
  //
  // When the user clicks the
  // verification link, Supabase
  // redirects them here with an
  // auth code in the URL (?code=…).
  // The client exchanges that code
  // for a session asynchronously.
  // We MUST wait for the SIGNED_IN
  // event — calling getUser() right
  // away almost always returns null
  // because the exchange isn't done.
  // ─────────────────────────────────

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Timeout safety net — if
    // nothing fires in 15 s, bail.

    const timeout = setTimeout(
      () => {
        subscription.unsubscribe();

        toast.error(
          "Session timed out. Please log in."
        );

        window.location.href =
          "/login";
      },
      15_000
    );

    // Subscribe BEFORE any await so
    // we never miss the SIGNED_IN
    // event that fires right after
    // the code exchange.

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log(
            "AUTH STATE",
            event,
            session?.user?.id
          );

          if (
            event ===
              "SIGNED_IN" &&
            session?.user
          ) {
            // Token exchanged — user
            // is now authenticated.
            clearTimeout(timeout);
            subscription.unsubscribe();

            await completeRegistration(
              session.user
            );

            return;
          }

          if (
            event ===
            "INITIAL_SESSION"
          ) {
            if (session?.user) {
              // Already logged in
              // (e.g. page refresh).
              clearTimeout(timeout);
              subscription.unsubscribe();

              await completeRegistration(
                session.user
              );
            }
            // If null, wait for
            // SIGNED_IN after code
            // exchange completes.
          }
        }
      );

    // Cleanup on unmount.
    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      className="
        relative

        flex
        min-h-screen

        items-center
        justify-center

        overflow-hidden

        bg-[#050816]

        px-6

        text-white
      "
    >
      {/* BACKGROUND */}

      <div
        className="
          absolute
          inset-0

          overflow-hidden
        "
      >
        <div
          className="
            absolute
            left-[-120px]
            top-[-120px]

            h-[360px]
            w-[360px]

            rounded-full

            bg-violet-500/15

            blur-[160px]
          "
        />

        <div
          className="
            absolute
            bottom-[-120px]
            right-[-120px]

            h-[360px]
            w-[360px]

            rounded-full

            bg-cyan-500/10

            blur-[180px]
          "
        />
      </div>

      {/* CARD */}

      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          relative
          z-10

          w-full
          max-w-xl

          overflow-hidden

          rounded-[32px]

          border
          border-white/[0.08]

          bg-white/[0.035]

          p-8

          text-center

          backdrop-blur-3xl
        "
      >
        <div
          className="
            mx-auto

            flex
            h-20
            w-20

            items-center
            justify-center

            rounded-3xl

            border
            border-violet-500/20

            bg-violet-500/10
          "
        >
          {loading ? (
            <Loader2
              className="
                h-8
                w-8

                animate-spin

                text-violet-200
              "
            />
          ) : (
            <CheckCircle2
              className="
                h-8
                w-8

                text-emerald-300
              "
            />
          )}
        </div>

        <div
          className="
            mt-6

            inline-flex
            items-center
            gap-2

            rounded-full

            border
            border-violet-500/20

            bg-violet-500/10

            px-4
            py-2

            text-[11px]
            uppercase

            tracking-[0.18em]

            text-violet-300
          "
        >
          <Sparkles
            size={12}
          />

          Orbit AI OS
        </div>

        <h1
          className="
            mt-8

            text-5xl
            font-semibold

            tracking-tight
          "
        >
          {loading
            ? "Synchronizing Orbit"
            : "Orbit Ready"}
        </h1>

        <p
          className="
            mx-auto
            mt-6

            max-w-md

            text-lg
            leading-relaxed

            text-white/60
          "
        >
          {status}
        </p>

        <div
          className="
            mt-10

            flex
            items-center
            justify-center
            gap-3

            text-sm
            text-violet-200
          "
        >
          <Brain
            size={16}
          />

          Orbit AI Operating System
        </div>
      </motion.div>
    </main>
  );
}
