"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { supabase } from "@/lib/supabase";
import { createWorkspace } from "@/server/actions/workspace/createWorkspace";
import { setActiveWorkspace } from "@/server/actions/workspace/setActiveWorkspace";
import { createContact } from "@/server/actions/crm/createContact";
import AiCore from "@/components/ui/AiCore";
import GunimiInput from "@/components/ui/GunimiInput";

type Phase = "checking" | "naming" | "creating" | "contact" | "email" | "done";

const STEP_LABELS = ["workspace", "contact", "email"] as const;

function StepDots({ active }: { active: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {STEP_LABELS.map((_, i) => (
        <span
          key={i}
          className={[
            "h-1.5 rounded-full transition-all duration-500",
            i === active
              ? "w-5 bg-[#6D5BFF]"
              : i < active
              ? "w-1.5 bg-[#6D5BFF]/40"
              : "w-1.5 bg-white/[0.08]",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

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

  // Contact step state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSavingContact, setIsSavingContact] = useState(false);

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
    setPhase("contact");
  }

  async function handleAddContact() {
    const name = contactName.trim();
    if (!name) {
      toast.error(t("setupContactNameRequired"));
      return;
    }

    setIsSavingContact(true);
    try {
      await createContact({
        name,
        email: contactEmail.trim() || undefined,
      });
    } catch {
      // non-critical — move on regardless
    } finally {
      setIsSavingContact(false);
    }

    setPhase("email");
  }

  function handleSkipContact() {
    setPhase("email");
  }

  function handleSkipEmail() {
    setPhase("done");
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 900);
  }

  // ── Checking phase ─────────────────────────────────────────────
  if (phase === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05060A]">
        <div className="opacity-0" aria-hidden />
      </main>
    );
  }

  // ── Naming phase ───────────────────────────────────────────────
  if (phase === "naming") {
    return card(
      <div className="text-center">
        <StepDots active={0} />

        <div className="mb-7 flex justify-center">
          <AiCore size={72} showRings showParticles={false} intensity="strong" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3 py-1">
          <AiCore size={10} showRings={false} showParticles={false} intensity="medium" />
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8B7DFF]">
            Gunimi
          </span>
        </div>

        <h1 className="mt-7 text-[26px] font-semibold tracking-[-0.03em] text-[#F7F8FC]">
          {t("setupNameHeading")}
        </h1>
        <p className="mx-auto mt-2.5 max-w-[340px] text-[13px] leading-relaxed text-[#9AA3B2]">
          {t("setupNameSubtitle")}
        </p>

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

  // ── Contact phase ──────────────────────────────────────────────
  if (phase === "contact") {
    return card(
      <AnimatePresence mode="wait">
        <motion.div
          key="contact"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <StepDots active={1} />

          <div className="mb-7 flex justify-center">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[22px] border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08]">
              <User size={28} className="text-[#8B7DFF]" />
            </div>
          </div>

          <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-[#F7F8FC]">
            {t("setupContactHeading")}
          </h1>
          <p className="mx-auto mt-2.5 max-w-[340px] text-[13px] leading-relaxed text-[#9AA3B2]">
            {t("setupContactSubtitle")}
          </p>

          <div className="mt-8 space-y-3 text-left">
            <GunimiInput
              type="text"
              placeholder={t("setupContactNamePlaceholder")}
              value={contactName}
              autoFocus
              onChange={(e) => setContactName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && contactName.trim()) handleAddContact(); }}
            />
            <GunimiInput
              type="email"
              placeholder={t("setupContactEmailPlaceholder")}
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && contactName.trim()) handleAddContact(); }}
            />
          </div>

          <button
            type="button"
            onClick={handleAddContact}
            disabled={!contactName.trim() || isSavingContact}
            className="group relative mt-4 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-[12px] border border-[#6D5BFF]/30 bg-[#6D5BFF] text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(109,91,255,0.40)] transition-all duration-300 hover:bg-[#7B6BFF] hover:shadow-[0_0_32px_rgba(109,91,255,0.55)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.10),transparent_55%)]" />
            <span className="relative z-10">
              {isSavingContact ? t("setupContactSaving") : t("setupContactCta")}
            </span>
            {!isSavingContact && (
              <ArrowRight size={15} className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleSkipContact}
            className="mt-4 w-full text-center text-[12.5px] text-[#9AA3B2]/50 transition-colors hover:text-[#9AA3B2]/80"
          >
            {t("setupContactSkip")}
          </button>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Email phase ────────────────────────────────────────────────
  if (phase === "email") {
    return card(
      <AnimatePresence mode="wait">
        <motion.div
          key="email"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <StepDots active={2} />

          <div className="mb-7 flex justify-center">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[22px] border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08]">
              <Mail size={28} className="text-[#8B7DFF]" />
            </div>
          </div>

          <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-[#F7F8FC]">
            {t("setupEmailHeading")}
          </h1>
          <p className="mx-auto mt-2.5 max-w-[340px] text-[13px] leading-relaxed text-[#9AA3B2]">
            {t("setupEmailSubtitle")}
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href="/api/email/connect/gmail"
              className="group relative flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-[12px] border border-white/[0.08] bg-white/[0.04] text-[14px] font-medium text-[#C8CDD8] transition-all hover:border-red-500/20 hover:bg-red-500/[0.06] hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 24.5c0-1.4-.1-2.7-.4-4H24v7.6h11.3a9.7 9.7 0 0 1-4.2 6.4v5.3h6.8C41.8 36.2 44 30.8 44 24.5z" fill="#4285F4"/>
                <path d="M24 45c5.7 0 10.5-1.9 14-5.1l-6.8-5.3c-1.9 1.3-4.3 2-7.2 2-5.5 0-10.2-3.7-11.9-8.8H5.1v5.5A21 21 0 0 0 24 45z" fill="#34A853"/>
                <path d="M12.1 27.8A12.6 12.6 0 0 1 11.5 24c0-1.3.2-2.6.6-3.8v-5.5H5.1A21 21 0 0 0 3 24c0 3.4.8 6.6 2.1 9.3l7-5.5z" fill="#FBBC05"/>
                <path d="M24 11.4c3.1 0 5.9 1.1 8.1 3.1l6-6A21 21 0 0 0 5.1 14.7l7 5.5c1.7-5.1 6.4-8.8 11.9-8.8z" fill="#EA4335"/>
              </svg>
              {t("setupEmailGmail")}
            </a>

            <a
              href="/api/email/connect/outlook"
              className="group relative flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-[12px] border border-white/[0.08] bg-white/[0.04] text-[14px] font-medium text-[#C8CDD8] transition-all hover:border-sky-500/20 hover:bg-sky-500/[0.06] hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28 8h16v14H28z" fill="#0364B8"/>
                <path d="M28 24h16v16H28z" fill="#0078D4"/>
                <path d="M4 8h22v14H4z" fill="#28A8E8"/>
                <path d="M4 24h22v16H4z" fill="#0364B8"/>
              </svg>
              {t("setupEmailOutlook")}
            </a>
          </div>

          <button
            type="button"
            onClick={handleSkipEmail}
            className="mt-5 w-full text-center text-[12.5px] text-[#9AA3B2]/50 transition-colors hover:text-[#9AA3B2]/80"
          >
            {t("setupEmailSkip")}
          </button>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Creating / Done phases ─────────────────────────────────────
  return card(
    <div className="text-center">
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

      <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3 py-1">
        <AiCore size={10} showRings={false} showParticles={false} intensity="medium" />
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8B7DFF]">
          Gunimi
        </span>
      </div>

      <h1 className="mt-7 text-[28px] font-semibold tracking-[-0.03em] text-[#F7F8FC]">
        {phase === "done" ? t("setupDone") : t("setupTitle")}
      </h1>

      <p className="mx-auto mt-3 max-w-[340px] text-[14px] leading-relaxed text-[#9AA3B2]">
        {status}
      </p>

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
