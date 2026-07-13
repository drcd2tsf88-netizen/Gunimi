"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { supabase } from "@/lib/supabase";
import GunimiInput from "@/components/ui/GunimiInput";
import AiCore from "@/components/ui/AiCore";
import AuthCard from "@/components/auth/AuthCard";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reason") === "session_expired") {
      const t1 = setTimeout(() => {
        toast(t("sessionExpiredLogin"), { icon: "🔒" });
      }, 0);
      return () => clearTimeout(t1);
    }
  }, [t]);

  async function handleLogin() {
    if (!email || !password) {
      toast.error(t("fillAllFields"));
      return;
    }
    if (!isValidEmail(email)) {
      toast.error(t("invalidEmail"));
      return;
    }
    try {
      setLoading(true);
      toast.loading(t("loginInitializing"), { id: "orbit-login" });

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error(t("loginFailed"), { id: "orbit-login" });
        return;
      }

      await supabase.auth.refreshSession();

      const params = new URLSearchParams(window.location.search);
      const invite = params.get("invite");
      if (invite) {
        router.push(`/invite/${invite}`);
        return;
      }

      if (!data.user) {
        toast.error(t("loginNoUser"), { id: "orbit-login" });
        return;
      }

      toast.loading(t("loginSyncing"), { id: "orbit-login" });
      router.refresh();
      setTimeout(() => { router.push("/dashboard"); }, 250);
    } catch {
      toast.error(t("loginFailed"), { id: "orbit-login" });
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
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="h-1.5 w-1.5 rounded-full bg-[#8B7DFF]"
        />
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8B7DFF]">
          {t("badge")}
        </span>
      </div>

      {/* HEADER */}
      <div className="mt-6">
        <h1 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#F7F8FC]">
          {t("loginTitle")}
        </h1>
        <p className="mt-2 text-[14px] leading-[1.65] text-[#9AA3B2]">
          {t("loginSubtitle")}
        </p>
      </div>

      {/* FORM */}
      <form
        className="mt-8 space-y-3"
        onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
      >
        <GunimiInput
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          disabled={loading}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <GunimiInput
          type="password"
          placeholder={t("passwordPlaceholder")}
          value={password}
          disabled={loading}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end pt-1">
          <Link
            href="/register/forgot-password"
            className="text-[12.5px] text-[#9AA3B2]/60 transition-colors duration-200 hover:text-[#9AA3B2]"
          >
            {t("forgotPassword")}
          </Link>
        </div>

        {/* PRIMARY CTA */}
        <button
          type="submit"
          disabled={loading}
          className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-[12px] border border-[#6D5BFF]/30 bg-[#6D5BFF] text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(109,91,255,0.40)] transition-all duration-300 hover:bg-[#7B6BFF] hover:shadow-[0_0_32px_rgba(109,91,255,0.55)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.10),transparent_55%)]" />
          <span className="relative z-10">
            {loading ? t("signingIn") : t("signIn")}
          </span>
          {!loading && <ArrowRight size={15} className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />}
        </button>
      </form>

      {/* FOOTER */}
      <div className="mt-7 flex items-center justify-between border-t border-white/[0.05] pt-6">
        <div className="flex items-center gap-2 text-[12px] text-[#9AA3B2]/45">
          <AiCore size={16} showRings={false} showParticles={false} intensity="medium" />
          {t("aiWorkspaceActive")}
        </div>
        <p className="text-[13px] text-[#9AA3B2]/60">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-[#C8CDD8] transition-colors duration-200 hover:text-[#F7F8FC]">
            {t("createAccount")}
          </Link>
        </p>
      </div>

    </AuthCard>
  );
}
