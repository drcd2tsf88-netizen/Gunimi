"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { supabase } from "@/lib/supabase";
import GunimiInput from "@/components/ui/GunimiInput";
import AiCore from "@/components/ui/AiCore";
import AuthCard from "@/components/auth/AuthCard";

export default function ResetPasswordPage() {
  const t = useTranslations("auth");
  const router = useRouter();

  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading]               = useState(false);
  const [ready, setReady]                   = useState(false);
  const [success, setSuccess]               = useState(false);

  // Wait for Supabase to finish the PKCE code exchange before enabling the form.
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") {
        subscription.unsubscribe();
        setReady(true);
        return;
      }
      if (event === "INITIAL_SESSION") {
        if (session) {
          subscription.unsubscribe();
          setReady(true);
        }
      }
    });

    const timeout = setTimeout(() => {
      subscription.unsubscribe();
      toast.error(t("sessionExpired"));
      router.push("/register/forgot-password");
    }, 15_000);

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleResetPassword() {
    if (!password || !confirmPassword) {
      toast.error(t("fillAllFields"));
      return;
    }
    if (password.length < 8) {
      toast.error(t("passwordTooShort"));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t("passwordsMustMatch"));
      return;
    }
    try {
      setLoading(true);
      toast.loading(t("updating"), { id: "orbit-password" });

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error(t("passwordUpdateFailed"), { id: "orbit-password" });
        return;
      }

      setSuccess(true);
      toast.success(t("passwordUpdated"), { id: "orbit-password" });

      setTimeout(() => { router.push("/login"); }, 2200);
    } catch {
      toast.error(t("passwordUpdateFailed"), { id: "orbit-password" });
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05060A] text-white">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]">
          <AiCore size={400} showRings showParticles={false} intensity="subtle" />
        </div>
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative z-10 text-[13px] text-[#9AA3B2]/60"
        >
          {t("validatingSession")}
        </motion.div>
      </main>
    );
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
        <ShieldCheck size={10} className="text-[#8B7DFF]" />
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8B7DFF]">
          {t("resetBadge")}
        </span>
      </div>

      {/* HEADER */}
      <div className="mt-6">
        <h1 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#F7F8FC]">
          {t("resetTitle")}
        </h1>
        <p className="mt-2 text-[14px] leading-[1.65] text-[#9AA3B2]">
          {t("resetSubtitle")}
        </p>
      </div>

      {/* SUCCESS STATE */}
      {success ? (
        <div className="mt-8 flex items-start gap-3 rounded-[12px] border border-emerald-500/[0.15] bg-emerald-500/[0.06] p-5">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
          <div>
            <p className="text-[13px] font-medium text-[#C8CDD8]">{t("resetSuccessTitle")}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-[#9AA3B2]">{t("resetSuccessDesc")}</p>
          </div>
        </div>
      ) : (
        <form
          className="mt-8 space-y-3"
          onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}
        >
          <GunimiInput
            type="password"
            placeholder={t("newPasswordPlaceholder")}
            value={password}
            disabled={loading}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <GunimiInput
            type="password"
            placeholder={t("confirmPasswordPlaceholder2")}
            value={confirmPassword}
            disabled={loading}
            autoComplete="new-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* INFO */}
          <div className="flex items-start gap-3 rounded-[10px] border border-[#6D5BFF]/[0.12] bg-[#6D5BFF]/[0.06] px-4 py-3.5">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#8B7DFF]" />
            <div>
              <p className="text-[13px] font-medium text-[#C8CDD8]">{t("secureUpdateTitle")}</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-[#9AA3B2]">{t("secureUpdateDesc")}</p>
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
              {loading ? t("updating") : t("updatePassword")}
            </span>
            {!loading && <ArrowRight size={15} className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />}
          </button>
        </form>
      )}

      {/* FOOTER */}
      <div className="mt-7 border-t border-white/[0.05] pt-6 text-[13px] text-[#9AA3B2]/60">
        {t("returnToLogin")}{" — "}
        <Link href="/login" className="text-[#C8CDD8] transition-colors duration-200 hover:text-[#F7F8FC]">
          {t("signIn")}
        </Link>
      </div>

    </AuthCard>
  );
}
