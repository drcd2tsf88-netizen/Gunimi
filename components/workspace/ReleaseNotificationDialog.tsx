"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useIsHydrated } from "@/lib/hooks/useIsHydrated";
import { CURRENT_RELEASE } from "@/lib/releases/current";

export default function ReleaseNotificationDialog() {
  const t = useTranslations("release");
  const hydrated = useIsHydrated();
  const [dismissed, setDismissed] = useState(false);

  function dismiss() {
    localStorage.setItem(CURRENT_RELEASE.storageKey, "1");
    setDismissed(true);
  }

  const visible =
    hydrated &&
    !dismissed &&
    !localStorage.getItem(CURRENT_RELEASE.storageKey);

  const bullets = t.raw("bullets") as string[];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t("ariaLabel")}
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-50 w-full max-w-[360px] overflow-hidden rounded-[20px] border border-white/[0.07] bg-[#0A0E17] shadow-[0_8px_48px_rgba(0,0,0,0.55),0_0_0_1px_rgba(109,91,255,0.08)]"
        >
          {/* Top accent line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-[#6D5BFF] via-[#A998FF] to-transparent" />

          <div className="p-5">
            {/* Badge row */}
            <div className="mb-3 flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-2.5 py-0.5">
                <Sparkles size={10} className="text-[#8B7DFF]" aria-hidden="true" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8B7DFF]">
                  {t("badge")}
                </span>
              </div>
              <span className="text-[11px] text-white/25">
                v{CURRENT_RELEASE.version}
              </span>
            </div>

            {/* Title */}
            <p className="text-[15px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#F7F8FC]">
              {t("title")}
            </p>

            {/* Bullets */}
            <ul className="mt-3 space-y-2">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#6D5BFF]/50"
                  />
                  <span className="text-[13px] leading-[1.55] text-[#9AA3B2]">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="mt-4 flex items-center gap-2">
              <Link
                href={CURRENT_RELEASE.changelogHref}
                onClick={dismiss}
                className="flex items-center gap-1.5 text-[12px] font-medium text-[#8B7DFF]/70 transition-colors hover:text-[#8B7DFF] focus-visible:outline-none"
              >
                {t("readMore")}
                <ArrowRight size={11} aria-hidden="true" />
              </Link>
              <div className="flex-1" />
              <button
                type="button"
                onClick={dismiss}
                className="rounded-[8px] border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-[#9AA3B2] transition-colors hover:border-white/[0.14] hover:text-[#F7F8FC] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6D5BFF]"
              >
                {t("dismiss")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
