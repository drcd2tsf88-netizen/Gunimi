"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { supabase } from "@/lib/supabase";
import OrbitInput from "@/components/ui/OrbitInput";
import AiCore from "@/components/ui/AiCore";
import AuthCard from "@/components/auth/AuthCard";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();

  const [fullName, setFullName]             = useState("");
  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading]               = useState(false);

  async function handleRegister() {
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error(t("fillAllFields"));
      return;
    }
    if (!isValidEmail(email)) {
      toast.error(t("invalidEmail"));
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
      toast.loading(t("loginInitializing"), { id: "orbit-register" });

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/register/complete`,
          data: { full_name: fullName },
        },
      });

      if (error) {
        toast.error(t("registerFailed"), { id: "orbit-register" });
        return;
      }

      toast.success(t("verificationSent"), { id: "orbit-register" });
      router.push(`/register/verify?email=${encodeURIComponent(email)}`);
    } catch {
      toast.error(t("registerFailed"), { id: "orbit-register" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard maxWidth="max-w-[520px]">

      {/* BRAND MARK */}
      <div className="mb-8 flex items-center gap-2.5">
        <AiCore size={24} showRings={false} showParticles={false} intensity="strong" />
        <span className="text-[13px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">Gunimi</span>
      </div>

      {/* BADGE */}
      <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3 py-1">
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="h-1.5 w-1.5 rounded-full bg-[#8B7DFF]"
        />
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8B7DFF]">
          {t("registerBadge")}
        </span>
      </div>

      {/* HEADER */}
      <div className="mt-6">
        <h1 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#F7F8FC]">
          {t("registerTitle")}
        </h1>
        <p className="mt-2 text-[14px] leading-[1.65] text-[#9AA3B2]">
          {t("registerSubtitle")}
        </p>
      </div>

      {/* FORM */}
      <form
        className="mt-8 space-y-3"
        onSubmit={(e) => { e.preventDefault(); handleRegister(); }}
      >
        <OrbitInput
          type="text"
          placeholder={t("fullNamePlaceholder")}
          value={fullName}
          disabled={loading}
          autoComplete="name"
          onChange={(e) => setFullName(e.target.value)}
        />
        <OrbitInput
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          disabled={loading}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <OrbitInput
          type="password"
          placeholder={t("passwordPlaceholder")}
          value={password}
          disabled={loading}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <OrbitInput
          type="password"
          placeholder={t("confirmPasswordPlaceholder")}
          value={confirmPassword}
          disabled={loading}
          autoComplete="new-password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* VERIFICATION NOTICE */}
        <div className="flex items-start gap-3 rounded-[10px] border border-[#6D5BFF]/[0.12] bg-[#6D5BFF]/[0.06] px-4 py-3.5">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#8B7DFF]" />
          <div>
            <p className="text-[13px] font-medium text-[#C8CDD8]">{t("emailVerificationTitle")}</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-[#9AA3B2]">
              {t("emailVerificationDesc")}
            </p>
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
            {loading ? t("creatingAccount") : t("signUp")}
          </span>
          {!loading && <ArrowRight size={15} className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />}
        </button>
      </form>

      {/* FOOTER */}
      <div className="mt-7 flex flex-col gap-4 border-t border-white/[0.05] pt-6 md:flex-row md:items-center md:justify-between">
        <p className="text-[13px] text-[#9AA3B2]/60">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="text-[#C8CDD8] transition-colors duration-200 hover:text-[#F7F8FC]">
            {t("login")}
          </Link>
        </p>
        <p className="text-[11.5px] leading-relaxed text-[#9AA3B2]/35">
          {t("termsPrefix")}{" "}
          <Link href="/terms" className="underline underline-offset-2 transition-colors hover:text-[#9AA3B2]/60">
            {t("termsLink")}
          </Link>
          {" "}{t("and")}{" "}
          <Link href="/privacy" className="underline underline-offset-2 transition-colors hover:text-[#9AA3B2]/60">
            {t("privacyLink")}
          </Link>
        </p>
      </div>

    </AuthCard>
  );
}
