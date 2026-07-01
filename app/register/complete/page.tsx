"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Brain, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function RegisterCompletePage() {
  const t = useTranslations("auth");
  const hasStarted = useRef(false);

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  async function completeRegistration(user: User) {
    try {
      setStatus(t("loginSyncing"));

      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id, platform_role")
        .eq("id", user.id)
        .maybeSingle();

      let profileError: unknown = null;
      let profile: { platform_role: string } | null = existingProfile;

      if (existingProfile) {
        const { error } = await supabase
          .from("profiles")
          .update({
            email: user.email,
            full_name: user.user_metadata?.full_name || "",
            avatar_url: user.user_metadata?.avatar_url || "",
            onboarding_completed: true,
          })
          .eq("id", user.id);

        profileError = error;
      } else {
        const { data: newProfile, error } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || "",
            avatar_url: user.user_metadata?.avatar_url || "",
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
        toast.error(t("completeProfileFailed"));
        setLoading(false);
        return;
      }

      setStatus(t("completeSyncing"));

      const { data: existingMembership, error: membershipCheckError } = await supabase
        .from("workspace_members")
        .select("id, role, workspace_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (membershipCheckError) {
        toast.error(t("completeMembershipFailed"));
        setLoading(false);
        return;
      }

      if (!existingMembership) {
        setStatus(t("completeInitializingWorkspace"));

        const workspaceSlug = `orbit-${user.id.slice(0, 8)}`;

        const { data: existingWorkspace } = await supabase
          .from("workspaces")
          .select("*")
          .eq("slug", workspaceSlug)
          .limit(1)
          .maybeSingle();

        let workspace = existingWorkspace;

        if (!workspace) {
          const { data: newWorkspace, error: workspaceError } = await supabase
            .from("workspaces")
            .insert({
              name: "My Workspace",
              slug: workspaceSlug,
            })
            .select()
            .single();

          if (workspaceError || !newWorkspace) {
            toast.error(t("completeWorkspaceFailed"));
            setLoading(false);
            return;
          }

          workspace = newWorkspace;
        }

        const { error: membershipError } = await supabase
          .from("workspace_members")
          .insert({
            workspace_id: workspace.id,
            user_id: user.id,
            role: "owner",
          })
          .select()
          .single();

        if (membershipError) {
          toast.error(t("completeMembershipFailed"));
          setLoading(false);
          return;
        }
      }

      const inviteToken = localStorage.getItem("orbit_invite_token");

      if (inviteToken) {
        localStorage.removeItem("orbit_invite_token");
        window.location.href = `/invite/${inviteToken}`;
        return;
      }

      setStatus(t("completeReady"));
      toast.success(t("completeSuccess"));
      setLoading(false);

      const role = profile?.platform_role || "user";
      const hasAccess = role === "beta" || role === "team" || role === "admin";

      setTimeout(() => {
        window.location.href = hasAccess ? "/dashboard" : "/waitlist";
      }, 1200);
    } catch {
      toast.error(t("completeFailed"));
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    setStatus(t("completeInitializing"));

    const timeout = setTimeout(() => {
      subscription.unsubscribe();
      toast.error(t("completeSessionTimedOut"));
      window.location.href = "/login";
    }, 15_000);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        clearTimeout(timeout);
        subscription.unsubscribe();
        await completeRegistration(session.user);
        return;
      }

      if (event === "INITIAL_SESSION") {
        if (session?.user) {
          clearTimeout(timeout);
          subscription.unsubscribe();
          await completeRegistration(session.user);
        }
      }
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-6 text-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[360px] w-[360px] rounded-full bg-violet-500/15 blur-[160px]" />
        <div className="absolute bottom-[-120px] right-[-120px] h-[360px] w-[360px] rounded-full bg-cyan-500/10 blur-[180px]" />
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.035] p-8 text-center backdrop-blur-3xl"
      >
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-500/20 bg-violet-500/10"
          aria-hidden="true"
        >
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-violet-200" />
          ) : (
            <CheckCircle2 className="h-8 w-8 text-emerald-300" />
          )}
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-violet-300">
          <Sparkles size={12} />
          Orbit AI OS
        </div>

        <h1 className="mt-8 text-5xl font-semibold tracking-tight">
          {loading ? t("completeLoading") : t("completeLoadingDone")}
        </h1>

        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-white/60">{status}</p>

        <div className="mt-10 flex items-center justify-center gap-3 text-sm text-violet-200">
          <Brain size={16} />
          Orbit AI Operating System
        </div>
      </motion.div>
    </main>
  );
}
