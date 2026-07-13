"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { supabase } from "@/lib/supabase";
import { createWorkspace } from "@/server/actions/workspace/createWorkspace";
import { setActiveWorkspace } from "@/server/actions/workspace/setActiveWorkspace";
import AiCore from "@/components/ui/AiCore";
import GunimiInput from "@/components/ui/GunimiInput";

type Phase = "checking" | "naming" | "creating" | "done";

function card(children: React.ReactNode) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05060A] px-6 text-white">
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
        key="card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-[28px] border border-white/[0.055] bg-[#0A0E17] p-10 shadow-[0_8px_60px_rgba(109,91,255,0.14)]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at top, rgba(109,91,255,0.07), transparent 55%)" }}
        />
        <div className="relative z-10">{children}</div>
      </motion.div>
    </main>
  );
}

export default function RegisterSetupPage() {
  const t = useTranslations("auth");
  const hasChecked = useRef(false);

  const [phase, setPhase] = useState<Phase>("checking");
  const [workspaceName, setWorkspaceName] = useState("");
  const [status, setStatus] = useState("");

  // On mount: silently check if workspace already exists.
  // If so, skip naming and redirect immediately.
  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    async function checkExisting() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = "/login"; return; }

      const { data: existing } = await supabase
        .from("workspace_members")
        .select("workspace_id")
        .eq("user_id", session.user.id)
        .limit(1)
        .maybeSingle();

      if (existing) {
        await setActiveWorkspace(existing.workspace_id);
        window.location.href = "/dashboard";
        return;
      }

      setPhase("naming");
    }

    checkExisting();
  }, []);

  async function handleCreate() {
    const name = workspaceName.trim();
    if (!name) {
      toast.error(t("setupNameRequired"));
      return;
    }

    setPhase("creating");
    setStatus(t("setupSyncing"));

    const timeout = setTimeout(() => {
      toast.error(t("setupTimedOut"));
      window.location.href = "/login";
    }, 30_000);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      clearTimeout(timeout);
      toast.error(t("completeSessionTimedOut"));
      window.location.href = "/login";
      return;
    }

    const workspace = await createWorkspace({ name });

    if (!workspace) {
      clearTimeout(timeout);
      toast.error(t("setupFailed"));
      setPhase("naming");
      return;
    }

    await setActiveWorkspace(workspace.id);

    clearTimeout(timeout);
    setStatus(t("setupReady"));
    setPhase("done");
    toast.success(t("setupSuccess"));

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1200);
  }

  // ── Checking phase — invisible, resolves in <500ms ─────────────
  if (phase === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05060A]">
        <div className="opacity-0" aria-hidden />
      </main>
    );
  }

  // ── Naming phase — workspace name input ────────────────────────
  if (phase === "naming") {
    return card(
      <div className="text-center">
        {/* Focal visual */}
        <div className="mb-7 flex justify-center">
          <AiCore size={72} showRings showParticles={false} intensity="strong" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3 py-1">
          <AiCore size={10} showRings={false} showParticles={false} intensity="medium" />
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8B7DFF]">
            Gunimi
          </span>
        </div>

        {/* Heading */}
        <h1 className="mt-7 text-[26px] font-semibold tracking-[-0.03em] text-[#F7F8FC]">
          {t("setupNameHeading")}
        </h1>
        <p className="mx-auto mt-2.5 max-w-[340px] text-[13px] leading-relaxed text-[#9AA3B2]">
          {t("setupNameSubtitle")}
        </p>

        {/* Input */}
        <div className="mt-8 text-left">
          <GunimiInput
            type="text"
            placeholder={t("setupNamePlaceholder")}
            value={workspaceName}
            autoFocus
            autoComplete="organization"
            onChange={(e) => setWorkspaceName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
          />
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleCreate}
          disabled={!workspaceName.trim()}
          className="group relative mt-4 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-[12px] border border-[#6D5BFF]/30 bg-[#6D5BFF] text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(109,91,255,0.40)] transition-all duration-300 hover:bg-[#7B6BFF] hover:shadow-[0_0_32px_rgba(109,91,255,0.55)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.10),transparent_55%)]" />
          <span className="relative z-10">{t("setupNameCta")}</span>
          <ArrowRight size={15} className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    );
  }

  // ── Creating / Done phases — loading and success ────────────────
  return card(
    <div className="text-center">
      {/* Focal visual */}
      <div className="relative mb-7 flex justify-center">
        <AnimatePresence mode="wait">
          {phase === "done" ? (
            <motion.div
              key="done"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-24 w-24 items-center justify-center rounded-full border border-emerald-500/[0.18] bg-emerald-500/[0.08]"
            >
              <CheckCircle2 size={36} className="text-emerald-400" />
            </motion.div>
          ) : (
            <motion.div
              key="creating"
              animate={{ scale: [0.97, 1.03, 0.97], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <AiCore size={96} showRings showParticles intensity="strong" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3 py-1">
        <AiCore size={10} showRings={false} showParticles={false} intensity="medium" />
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8B7DFF]">
          Gunimi
        </span>
      </div>

      {/* Title */}
      <h1 className="mt-7 text-[28px] font-semibold tracking-[-0.03em] text-[#F7F8FC]">
        {phase === "done" ? t("setupDone") : t("setupTitle")}
      </h1>

      {/* Status */}
      <p className="mx-auto mt-3 max-w-[340px] text-[14px] leading-relaxed text-[#9AA3B2]">
        {status}
      </p>

      {/* Progress dots */}
      {phase === "creating" && (
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
  );
}
