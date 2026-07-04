"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const CONSENT_KEY = "gunimi_cookie_consent";

function getInitialVisibility(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !localStorage.getItem(CONSENT_KEY);
  } catch {
    return false;
  }
}

export default function CookieConsent() {
  const t = useTranslations("public.cookieConsent");
  const [visible, setVisible] = useState(getInitialVisibility);

  function accept() {
    try { localStorage.setItem(CONSENT_KEY, "accepted"); } catch { /* */ }
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem(CONSENT_KEY, "declined"); } catch { /* */ }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 right-5 z-[9999] w-full max-w-[380px]"
          role="dialog"
          aria-label={t("title")}
          aria-modal="false"
        >
          {/* CARD */}
          <div className="relative overflow-hidden rounded-[20px] border border-white/[0.055] bg-[#0A0E17] p-5 shadow-[0_8px_40px_rgba(109,91,255,0.18)]">
            {/* Top sheen */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />
            {/* Inner ambient */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse at top, rgba(109,91,255,0.06), transparent 55%)" }}
            />

            <div className="relative z-10">
              {/* HEADER */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#6D5BFF]/[0.10] text-[#8B7DFF]">
                    <Cookie size={14} />
                  </div>
                  <p className="text-[13.5px] font-semibold text-[#F7F8FC]">{t("title")}</p>
                </div>
                <button
                  onClick={decline}
                  aria-label={t("dismissAriaLabel")}
                  className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[#9AA3B2]/50 transition-colors duration-200 hover:text-[#9AA3B2]"
                >
                  <X size={13} />
                </button>
              </div>

              {/* BODY */}
              <p className="mt-3 text-[12.5px] leading-[1.6] text-[#9AA3B2]">
                {t("description")}{" "}
                <Link
                  href="/cookies"
                  className="text-[#8B7DFF]/70 underline underline-offset-2 transition-colors hover:text-[#8B7DFF]"
                >
                  {t("policyLink")}
                </Link>
              </p>

              {/* ACTIONS */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={accept}
                  className="flex-1 rounded-[10px] border border-[#6D5BFF]/30 bg-[#6D5BFF] px-4 py-2 text-[12.5px] font-semibold text-white shadow-[0_0_14px_rgba(109,91,255,0.35)] transition-all duration-300 hover:bg-[#7B6BFF] hover:shadow-[0_0_24px_rgba(109,91,255,0.50)]"
                >
                  {t("accept")}
                </button>
                <button
                  onClick={decline}
                  className="flex-1 rounded-[10px] border border-white/[0.07] bg-white/[0.03] px-4 py-2 text-[12.5px] font-medium text-[#9AA3B2] transition-all duration-300 hover:border-white/[0.12] hover:text-[#C8CDD8]"
                >
                  {t("decline")}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
