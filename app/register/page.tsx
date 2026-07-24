"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { registerUser } from "@/server/actions/auth/register";
import GunimiInput from "@/components/ui/GunimiInput";
import AiCore from "@/components/ui/AiCore";
import AuthCard from "@/components/auth/AuthCard";

// ─── Disposable email blocklist ───────────────────────────────
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com","guerrillamail.com","tempmail.com","throwaway.email",
  "yopmail.com","sharklasers.com","guerrillamailblock.com","grr.la",
  "guerrillamail.info","guerrillamail.biz","guerrillamail.de","guerrillamail.net",
  "guerrillamail.org","spam4.me","trashmail.com","trashmail.me","trashmail.net",
  "dispostable.com","mailnull.com","spamgourmet.com","spamgourmet.net",
  "maildrop.cc","discard.email","fakeinbox.com","tempinbox.com",
  "10minutemail.com","10minutemail.net","20minutemail.com","mailnesia.com",
  "mailnull.com","spamgourmet.com","mytemp.email","temp-mail.org",
  "emailondeck.com","getairmail.com","spamfree24.org","trashmail.at",
  "trashmail.io","spamherelots.com","throwam.com","tempsky.com",
  "spambox.us","inboxalias.com","filzmail.com","throwam.com",
]);

function isDisposableEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1] ?? "";
  return DISPOSABLE_DOMAINS.has(domain);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// ─── Password strength ────────────────────────────────────────
type StrengthLevel = 0 | 1 | 2 | 3 | 4;

function getPasswordStrength(pwd: string): StrengthLevel {
  if (pwd.length === 0) return 0;
  let score = 0;
  if (pwd.length >= 8)  score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return 1;
  if (score === 3) return 2;
  if (score <= 5) return 3;
  return 4;
}

function isPasswordStrong(pwd: string): boolean {
  return (
    pwd.length >= 8 &&
    /[A-Z]/.test(pwd) &&
    /[a-z]/.test(pwd) &&
    /[0-9]/.test(pwd) &&
    /[^A-Za-z0-9]/.test(pwd)
  );
}

const STRENGTH_COLORS: Record<StrengthLevel, string> = {
  0: "bg-white/[0.05]",
  1: "bg-[#EF4444]",
  2: "bg-[#F59E0B]",
  3: "bg-[#22c55e]",
  4: "bg-[#6D5BFF]",
};

// ─── PasswordStrengthBar ──────────────────────────────────────
function PasswordStrengthBar({
  password,
  labelWeak,
  labelFair,
  labelStrong,
  labelVeryStrong,
}: {
  password: string;
  labelWeak: string;
  labelFair: string;
  labelStrong: string;
  labelVeryStrong: string;
}) {
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  if (password.length === 0) return null;

  const labels: Record<StrengthLevel, string> = {
    0: "",
    1: labelWeak,
    2: labelFair,
    3: labelStrong,
    4: labelVeryStrong,
  };

  return (
    <div className="space-y-1.5 px-0.5">
      <div className="flex gap-1">
        {([1, 2, 3, 4] as StrengthLevel[]).map((level) => (
          <div
            key={level}
            className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
              strength >= level ? STRENGTH_COLORS[strength] : "bg-white/[0.07]"
            }`}
          />
        ))}
      </div>
      <p className={`text-[11px] font-medium transition-colors duration-200 ${
        strength === 1 ? "text-[#EF4444]" :
        strength === 2 ? "text-[#F59E0B]" :
        strength === 3 ? "text-[#22c55e]" :
        strength === 4 ? "text-[#8B7DFF]" : "text-transparent"
      }`}>
        {labels[strength]}
      </p>
    </div>
  );
}

// ─── RegisterPage ─────────────────────────────────────────────
export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();

  const [fullName, setFullName]               = useState("");
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading]                 = useState(false);

  async function handleRegister() {
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error(t("fillAllFields"));
      return;
    }
    if (!isValidEmail(email)) {
      toast.error(t("invalidEmail"));
      return;
    }
    if (isDisposableEmail(email)) {
      toast.error(t("disposableEmail"));
      return;
    }
    if (password.length < 8) {
      toast.error(t("passwordTooShort"));
      return;
    }
    if (!isPasswordStrong(password)) {
      toast.error(t("passwordTooWeak"));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t("passwordsMustMatch"));
      return;
    }

    try {
      setLoading(true);
      toast.loading(t("loginInitializing"), { id: "orbit-register" });

      const result = await registerUser(email, password, fullName);

      if ("error" in result) {
        toast.error(t(result.error as Parameters<typeof t>[0]), { id: "orbit-register" });
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
        <GunimiInput
          type="text"
          placeholder={t("fullNamePlaceholder")}
          value={fullName}
          disabled={loading}
          autoComplete="name"
          onChange={(e) => setFullName(e.target.value)}
        />
        <GunimiInput
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          disabled={loading}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="space-y-2">
          <GunimiInput
            type="password"
            placeholder={t("passwordPlaceholder")}
            value={password}
            disabled={loading}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordStrengthBar
            password={password}
            labelWeak={t("passwordStrengthWeak")}
            labelFair={t("passwordStrengthFair")}
            labelStrong={t("passwordStrengthStrong")}
            labelVeryStrong={t("passwordStrengthVeryStrong")}
          />
        </div>
        <GunimiInput
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
