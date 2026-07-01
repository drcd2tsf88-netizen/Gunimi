"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Brain, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import OrbitInput from "@/components/ui/OrbitInput";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-6 text-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[360px] w-[360px] rounded-full bg-violet-500/15 blur-[160px]" />
        <div className="absolute bottom-[-120px] right-[-120px] h-[360px] w-[360px] rounded-full bg-cyan-500/10 blur-[180px]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.035] p-8 backdrop-blur-3xl shadow-[0_0_80px_rgba(124,58,237,0.10)]"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-[220px] w-[220px] rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10">
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-violet-300">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-violet-400"
            />
            {t("registerBadge")}
          </div>

          {/* HEADER */}
          <div className="mt-6">
            <h1 className="text-4xl font-semibold tracking-tight">{t("registerTitle")}</h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
              {t("registerSubtitle")}
            </p>
          </div>

          {/* FORM */}
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
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
            <div className="flex items-start gap-3 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-4">
              <ShieldCheck size={18} className="mt-0.5 text-cyan-300" />
              <div>
                <p className="text-sm font-medium text-cyan-200">{t("emailVerificationTitle")}</p>
                <p className="mt-1 text-xs leading-relaxed text-cyan-100/60">
                  {t("emailVerificationDesc")}
                </p>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-violet-500/20 bg-violet-500/10 text-sm font-medium text-violet-100 transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-500/15 disabled:opacity-50"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.16),transparent_45%)]" />
              <span className="relative z-10">
                {loading ? t("creatingAccount") : t("signUp")}
              </span>
              {!loading && <ArrowRight size={16} className="relative z-10" />}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 flex flex-col gap-5 border-t border-white/[0.06] pt-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Brain size={14} className="text-cyan-300" />
              {t("aiIdentityLayer")}
            </div>
            <div className="text-sm text-zinc-500">
              {t("alreadyHaveAccount")}{" "}
              <Link href="/login" className="text-white transition-opacity hover:opacity-80">
                {t("login")}
              </Link>
            </div>
          </div>

          {/* TERMS */}
          <p className="mt-6 text-center text-xs leading-relaxed text-zinc-600">
            {t("termsPrefix")}{" "}
            <Link href="/terms" className="text-zinc-400 underline underline-offset-2 transition hover:text-white">
              {t("termsLink")}
            </Link>{" "}
            {t("and")}{" "}
            <Link href="/privacy" className="text-zinc-400 underline underline-offset-2 transition hover:text-white">
              {t("privacyLink")}
            </Link>
            .
          </p>
        </div>
      </motion.div>
    </main>
  );
}
