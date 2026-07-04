"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { supabase } from "@/lib/supabase";
import { createWorkspace } from "@/server/actions/workspace/createWorkspace";
import type { User } from "@supabase/supabase-js";
import AiCore from "@/components/ui/AiCore";

export default function RegisterCompletePage() {
  const t = useTranslations("auth");
  const hasStarted = useRef(false);

  const [status, setStatus]   = useState("");
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

        // createWorkspace uses supabaseAdmin server-side — bypasses RLS entirely.
        // Never use the browser client for workspace bootstrapping.
        const workspace = await createWorkspace({ name: "My Workspace" });

        if (!workspace) {
          toast.error(t("completeWorkspaceFailed"));
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05060A] px-6 text-white">

      {/* DEEP SPACE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-[600px] w-[700px] -translate-x-1/2 -translate-y-1/4"
          style={{
            background: "radial-gradient(ellipse, rgba(109,91,255,0.10), transparent 65%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-[28px] border border-white/[0.055] bg-[#0A0E17] p-10 text-center shadow-[0_8px_60px_rgba(109,91,255,0.14)]"
      >
        {/* TOP SHEEN */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />
        {/* INNER AMBIENT */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at top, rgba(109,91,255,0.07), transparent 55%)" }}
        />

        <div className="relative z-10">

          {/* FOCAL VISUAL */}
          <div className="relative mb-7 flex justify-center">
            {loading ? (
              <motion.div
                animate={{ scale: [0.97, 1.03, 0.97], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <AiCore size={96} showRings showParticles intensity="strong" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-24 w-24 items-center justify-center rounded-full border border-emerald-500/[0.18] bg-emerald-500/[0.08]"
              >
                <CheckCircle2 size={36} className="text-emerald-400" />
              </motion.div>
            )}
          </div>

          {/* BADGE */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3 py-1">
            <AiCore size={10} showRings={false} showParticles={false} intensity="medium" />
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8B7DFF]">
              Gunimi
            </span>
          </div>

          {/* TITLE */}
          <h1 className="mt-7 text-[28px] font-semibold tracking-[-0.03em] text-[#F7F8FC]">
            {loading ? t("completeLoading") : t("completeLoadingDone")}
          </h1>

          {/* STATUS */}
          <p className="mx-auto mt-3 max-w-[340px] text-[14px] leading-relaxed text-[#9AA3B2]">
            {status}
          </p>

          {/* PROGRESS DOTS */}
          {loading && (
            <div className="mt-8 flex items-center justify-center gap-1.5">
              {[0, 0.18, 0.36].map((delay) => (
                <motion.span
                  key={delay}
                  animate={{ opacity: [0.2, 0.7, 0.2] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay }}
                  className="h-1.5 w-1.5 rounded-full bg-[#6D5BFF]/60"
                />
              ))}
            </div>
          )}

        </div>
      </motion.div>
    </main>
  );
}
