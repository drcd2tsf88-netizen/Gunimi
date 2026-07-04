"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { supabase } from "@/lib/supabase";
import AiCore from "@/components/ui/AiCore";
import AuthCard from "@/components/auth/AuthCard";

function VerifyContent() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [resending, setResending] = useState(false);
  const [resent, setResent]       = useState(false);

  async function handleResend() {
    if (!email || resending) return;
    try {
      setResending(true);
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) {
        toast.error(t("resendFailed"));
        return;
      }
      setResent(true);
      toast.success(t("emailResent"));
    } catch {
      toast.error(t("resendFailed"));
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthCard maxWidth="max-w-[512px]" centered>

      {/* FOCAL VISUAL — AiCore with Mail overlay */}
      <div className="mb-7 flex justify-center">
        <div className="relative">
          {/* Ambient ring */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: "0 0 40px rgba(109,91,255,0.28)" }}
          />
          <AiCore size={80} showRings showParticles={false} intensity="strong" />
          {/* Mail icon floating below */}
          <div className="absolute -bottom-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-[#6D5BFF]/[0.22] bg-[#0A0E17]">
            <Mail size={13} className="text-[#8B7DFF]" aria-hidden />
          </div>
        </div>
      </div>

      {/* BADGE */}
      <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#8B7DFF]" />
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8B7DFF]">
          {t("verifyBadge")}
        </span>
      </div>

      {/* HEADER */}
      <h1 className="mt-6 text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#F7F8FC]">
        {t("verifyTitle")}
      </h1>
      <p className="mt-2.5 text-[14px] leading-[1.65] text-[#9AA3B2]">
        {t("verifyDescription")}
      </p>

      {/* EMAIL DISPLAY */}
      {email && (
        <div className="mt-5 flex items-center justify-center gap-2.5 rounded-[10px] border border-[#6D5BFF]/[0.12] bg-[#6D5BFF]/[0.06] px-4 py-3.5">
          <Mail size={13} className="shrink-0 text-[#8B7DFF]" aria-hidden />
          <p className="text-[13px] font-medium text-[#F7F8FC] break-all">{email}</p>
        </div>
      )}

      {/* WHAT'S NEXT */}
      <div className="mt-5 rounded-[10px] border border-white/[0.055] bg-white/[0.02] p-4 text-left">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#9AA3B2]/60">
          {t("whatsNext")}
        </p>
        <div className="mt-3.5 space-y-3">
          {[t("step1"), t("step2"), t("step3")].map((step, index) => (
            <div key={step} className="flex items-center gap-3">
              <div
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6D5BFF]/[0.12] text-[10px] font-semibold text-[#8B7DFF]"
                aria-hidden
              >
                {index + 1}
              </div>
              <p className="text-[13px] text-[#9AA3B2]">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-7 flex flex-col gap-3">
        <Link
          href="/login"
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-[12px] border border-[#6D5BFF]/30 bg-[#6D5BFF] text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(109,91,255,0.40)] transition-all duration-300 hover:bg-[#7B6BFF] hover:shadow-[0_0_32px_rgba(109,91,255,0.55)]"
        >
          {t("continueToLogin")}
          <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>

        <p className="text-[12px] text-[#9AA3B2]/40">
          {t("didntReceive")}{" "}
          {t("checkSpam")}{" "}
          {resent ? (
            <span className="text-emerald-400/70">{t("emailResent")}</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || !email}
              className="text-[#8B7DFF]/60 underline underline-offset-2 transition-colors hover:text-[#8B7DFF] disabled:opacity-40"
            >
              {resending ? t("resending") : t("resend")}
            </button>
          )}
        </p>
      </div>

    </AuthCard>
  );
}

export default function RegisterVerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}
