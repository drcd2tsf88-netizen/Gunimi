"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useIsHydrated } from "@/lib/hooks/useIsHydrated";

const WELCOME_KEY = "gunimi_welcome_seen_v1";

export default function WorkspaceWelcomeOverlay() {
  const t = useTranslations("awakening.welcome");
  const hydrated = useIsHydrated();
  const [dismissed, setDismissed] = useState(false);

  function dismiss() {
    localStorage.setItem(WELCOME_KEY, "1");
    setDismissed(true);
  }

  const visible = hydrated && !dismissed && !localStorage.getItem(WELCOME_KEY);
  const promises = t.raw("promises") as string[];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#05060A]/90 px-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[480px] overflow-hidden rounded-[24px] border border-white/[0.055] bg-[#0A0E17] p-8 shadow-[0_8px_60px_rgba(109,91,255,0.16)]"
          >
            {/* Top sheen */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6D5BFF]/40 to-transparent" />
            {/* Inner ambient */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse at top, rgba(109,91,255,0.08), transparent 55%)" }}
            />

            <div className="relative">
              {/* Ready badge */}
              <div className="mb-5 inline-flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--g-success)]" />
                <span className="text-[11px] font-medium tracking-[0.08em] text-[#9AA3B2]">
                  {t("readyLine")}
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-[20px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#F7F8FC]">
                {t("beforeYouStart")}
              </h2>

              {/* Promises */}
              <ul className="mt-5 space-y-4">
                {promises.map((promise, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ArrowRight
                      size={13}
                      aria-hidden="true"
                      className="mt-[3px] shrink-0 text-[#6D5BFF]/60"
                    />
                    <span className="text-[14px] leading-[1.65] text-[#9AA3B2]">{promise}</span>
                  </li>
                ))}
              </ul>

              {/* Closing line */}
              <p className="mt-5 text-[13px] leading-relaxed text-white/20">
                {t("closingLine")}
              </p>

              {/* CTAs */}
              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  href="/dashboard/contacts"
                  onClick={dismiss}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-[12px] bg-[#6D5BFF] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_0_16px_rgba(109,91,255,0.35)] transition-colors hover:bg-[#7B6BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E17]"
                >
                  {t("ctaPrimary")}
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={dismiss}
                  className="inline-flex flex-1 items-center justify-center rounded-[12px] border border-white/[0.08] px-5 py-2.5 text-[13px] font-medium text-[#9AA3B2] transition-colors hover:border-white/[0.14] hover:text-[#F7F8FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E17]"
                >
                  {t("ctaSecondary")}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
