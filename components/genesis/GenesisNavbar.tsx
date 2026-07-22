"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { AiCore } from "./AiCore";

export function GenesisNavbar() {
  const t = useTranslations("landing.nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      role="banner"
      className={cn(
        "fixed left-0 right-0 top-0 z-[20]",
        "border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-[rgba(255,255,255,0.06)] backdrop-blur-md"
          : "border-transparent",
      )}
      // bg-[#05060A]/80 requires hex literal — CSS variable opacity modifiers are not supported in Tailwind v4
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        ...(scrolled ? { backgroundColor: "rgba(5,6,10,0.82)" } : {}),
      }}
    >
      <nav
        aria-label={t("mainNav")}
        className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 md:px-20"
      >
        {/* ── Brand ── */}
        <Link
          href="/"
          aria-label="Gunimi"
          className="group flex items-center gap-2.5 rounded-[8px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g-bg)]"
        >
          <AiCore
            size={28}
            showRings={false}
            showParticles={false}
            intensity="strong"
          />
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--g-text)] transition-opacity duration-150 group-hover:opacity-80">
            Gunimi
          </span>
        </Link>

        {/* ── Primary action ── */}
        <Link
          href="/register"
          className={cn(
            "inline-flex min-h-[44px] items-center rounded-[10px] px-4 py-2",
            "bg-[var(--g-primary)] text-[13px] font-medium text-white",
            "transition-colors duration-150 hover:bg-[var(--g-primary-2)]",
            "outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g-bg)]",
          )}
        >
          {t("joinAlpha")}
        </Link>
      </nav>
    </header>
  );
}
