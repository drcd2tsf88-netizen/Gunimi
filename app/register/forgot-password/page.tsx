"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { supabase } from "@/lib/supabase";
import GunimiInput from "@/components/ui/GunimiInput";
import AiCore from "@/components/ui/AiCore";
import AuthCard from "@/components/auth/AuthCard";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");

  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);

  async function handleReset() {
    if (!email) {
      toast.error(t("fillAllFields"));
      return;
    }
    if (!isValidEmail(email)) {
      toast.error(t("invalidEmail"));
      return;
    }
    try {
      setLoading(true);
      toast.loading(t("sending"), { id: "orbit-reset" });

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/register/reset-password`,
      });

      if (error) {
        toast.error(t("recoveryFailed"), { id: "orbit-reset" });
        return;
      }

      setSent(true);
      toast.success(t("recoveryEmailSent"), { id: "orbit-reset" });
    } catch {
      toast.error(t("recoveryFailed"), { id: "orbit-reset" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard maxWidth="max-w-[448px]">

      {/* BRAND MARK */}
      <div className="mb-8 flex items-center gap-2.5">
        <AiCore size={24} showRings={false} showParticles={false} intensity="strong" />
        <span className="text-[13px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">Gunimi</span>
      </div>

      {/* BADGE */}
      <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3 py-1">
        <KeyRound size={10} className="text-[#8B7DFF]" />
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8B7DFF]">
          {t("forgotBadge")}
        </span>
      </div>

      {/* HEADER */}
      <div className="mt-6">
        <h1 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#F7F8FC]">
          {t("forgotTitle")}
        </h1>
        <p className="mt-2 text-[14px] leading-[1.65] text-[#9AA3B2]">
          {t("forgotSubtitle")}
        </p>
      </div>

      {/* SENT STATE */}
      {sent ? (
        <div className="mt-8 flex items-start gap-3 rounded-[12px] border border-emerald-500/[0.15] bg-emerald-500/[0.06] p-5">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
          <div>
            <p className="text-[13px] font-medium text-[#C8CDD8]">{t("sentTitle")}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-[#9AA3B2]">{t("sentDesc")}</p>
          </div>
        </div>
      ) : (
        <form
          className="mt-8 space-y-3"
          onSubmit={(e) => { e.preventDefault(); handleReset(); }}
        >
          <GunimiInput
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            disabled={loading}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* INFO */}
          <div className="flex items-start gap-3 rounded-[10px] border border-[#6D5BFF]/[0.12] bg-[#6D5BFF]/[0.06] px-4 py-3.5">
            <KeyRound size={14} className="mt-0.5 shrink-0 text-[#8B7DFF]" />
            <div>
              <p className="text-[13px] font-medium text-[#C8CDD8]">{t("secureFlowTitle")}</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-[#9AA3B2]">{t("secureFlowDesc")}</p>
            </div>
          </div>

          {/* PRIMARY CTA */}
          <button
            type="submit"
            disabled={loading}
            className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-[12px] border border-[#6D5BFF]/30 bg-[#6D5BFF] text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(109,91,255,0.40)] transition-all duration-300 hover:bg-[#7B6BFF] hover:shadow-[0_0_32px_rgba(109,91,255,0.55)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.10),transparent_55%)]" />
            <span className="relative z-10">
              {loading ? t("sending") : t("sendLink")}
            </span>
            {!loading && <ArrowRight size={15} className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />}
          </button>
        </form>
      )}

      {/* FOOTER */}
      <div className="mt-7 border-t border-white/[0.05] pt-6 text-[13px] text-[#9AA3B2]/60">
        {t("rememberedPassword")}{" "}
        <Link href="/login" className="text-[#C8CDD8] transition-colors duration-200 hover:text-[#F7F8FC]">
          {t("returnToLogin")}
        </Link>
      </div>

    </AuthCard>
  );
}
