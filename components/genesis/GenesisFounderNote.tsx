"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { FadeIn } from "./FadeIn";

export function GenesisFounderNote() {
  const t = useTranslations("landing.founder");

  return (
    <section className="relative overflow-hidden bg-[var(--g-bg)] px-6 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[640px]">
        <FadeIn duration={0.7}>
          <div className="relative rounded-[24px] border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

            {/* Label */}
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9AA3B2]/40">
              {t("heading")}
            </p>

            {/* Avatar + name */}
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#6D5BFF]/20 bg-[#6D5BFF]/[0.08] text-[18px] font-semibold text-[#8B7DFF]">
                M
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#F7F8FC]">Michal Guoth</p>
                <p className="text-[12px] text-[#9AA3B2]/50">{t("intro")}</p>
              </div>
            </div>

            {/* Body */}
            <p className="text-[15px] leading-[1.75] text-[#9AA3B2]/75">
              {t("body")}
            </p>

            {/* Email */}
            <div className="mt-6 border-t border-white/[0.05] pt-6">
              <Link
                href={`mailto:${t("emailLabel")}`}
                className="text-[13px] font-medium text-[#8B7DFF]/70 transition-colors hover:text-[#8B7DFF]"
              >
                {t("emailLabel")}
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
