"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import PublicLayout from "@/components/public/PublicLayout";
import { sendContactMessage } from "@/server/actions/contact/sendContactMessage";
import { MessageSquare, HelpCircle, Shield, Briefcase, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const t = useTranslations("public.contact");

  const CATEGORIES = [
    { id: "general",    label: t("categories.general"),    icon: MessageSquare },
    { id: "support",    label: t("categories.support"),    icon: HelpCircle },
    { id: "security",   label: t("categories.security"),   icon: Shield },
    { id: "enterprise", label: t("categories.enterprise"), icon: Briefcase },
  ];

  const [category, setCategory] = useState("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setResult(null);
    const res = await sendContactMessage({ name, email, category, message });
    setResult(res);
    setPending(false);
    if (res.ok) {
      setName(""); setEmail(""); setMessage(""); setCategory("general");
    }
  }

  return (
    <PublicLayout>
      <div className="relative overflow-hidden">

        {/* AMBIENT */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-0 h-[420px] w-[600px] -translate-x-1/2"
            style={{ background: "radial-gradient(ellipse, rgba(109,91,255,0.07), transparent 65%)", filter: "blur(80px)" }}
          />
        </div>

        {/* HERO */}
        <section className="relative mx-auto max-w-2xl px-6 pb-16 pt-24 text-center md:pt-32">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8B7DFF]">
              {t("badge")}
            </span>
          </div>
          <h1 className="text-[44px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC] md:text-[56px]">
            {t("headline")}
          </h1>
          <p className="mx-auto mt-5 max-w-[44ch] text-[16px] leading-[1.7] text-[#9AA3B2]">
            {t("subline")}
          </p>
        </section>

        {/* FORM */}
        <section className="relative mx-auto max-w-xl px-6 pb-32">
          <div className="relative overflow-hidden rounded-[24px] border border-white/[0.055] bg-[#0A0E17] p-8 shadow-[0_8px_60px_rgba(109,91,255,0.10)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse at top, rgba(109,91,255,0.05), transparent 55%)" }}
            />

            <form onSubmit={handleSubmit} className="relative z-10 space-y-5">

              {/* CATEGORY */}
              <div>
                <label className="mb-2.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9AA3B2]/60">
                  {t("categoryLabel")}
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {CATEGORIES.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCategory(id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-[12px] border py-3 text-[12px] font-medium transition-all duration-200",
                        category === id
                          ? "border-[#6D5BFF]/30 bg-[#6D5BFF]/[0.12] text-[#8B7DFF]"
                          : "border-white/[0.06] bg-white/[0.02] text-[#9AA3B2]/60 hover:border-white/[0.10] hover:text-[#9AA3B2]"
                      )}
                    >
                      <Icon size={15} strokeWidth={1.75} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* NAME */}
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9AA3B2]/60">
                  {t("nameLabel")}
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                  className="w-full rounded-[11px] border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-[14px] text-[#F7F8FC] placeholder-[#9AA3B2]/30 outline-none transition-all duration-200 focus:border-[#6D5BFF]/30 focus:bg-[#6D5BFF]/[0.04] focus:ring-0"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9AA3B2]/60">
                  {t("emailLabel")}
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="w-full rounded-[11px] border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-[14px] text-[#F7F8FC] placeholder-[#9AA3B2]/30 outline-none transition-all duration-200 focus:border-[#6D5BFF]/30 focus:bg-[#6D5BFF]/[0.04] focus:ring-0"
                />
              </div>

              {/* MESSAGE */}
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9AA3B2]/60">
                  {t("messageLabel")}
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("messagePlaceholder")}
                  className="w-full resize-none rounded-[11px] border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-[14px] text-[#F7F8FC] placeholder-[#9AA3B2]/30 outline-none transition-all duration-200 focus:border-[#6D5BFF]/30 focus:bg-[#6D5BFF]/[0.04] focus:ring-0"
                />
                <p className="mt-1 text-right text-[11px] text-[#9AA3B2]/30">
                  {message.length}/2000
                </p>
              </div>

              {/* RESULT */}
              {result?.ok && (
                <div className="flex items-center gap-2.5 rounded-[11px] border border-emerald-500/[0.15] bg-emerald-500/[0.06] px-4 py-3">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-400/80" />
                  <span className="text-[13px] text-emerald-400/80">
                    {t("successMessage")}
                  </span>
                </div>
              )}
              {result?.error && (
                <div className="flex items-center gap-2.5 rounded-[11px] border border-red-500/[0.14] bg-red-500/[0.06] px-4 py-3">
                  <AlertTriangle size={15} className="shrink-0 text-red-400/80" />
                  <span className="text-[13px] text-red-400/80">{result.error}</span>
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-[12px] border border-[#6D5BFF]/30 bg-[#6D5BFF] px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(109,91,255,0.35)] transition-all duration-300 hover:bg-[#7B6BFF] hover:shadow-[0_0_32px_rgba(109,91,255,0.50)] disabled:opacity-50"
              >
                {pending ? t("sendingLabel") : t("submitLabel")}
              </button>

            </form>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
