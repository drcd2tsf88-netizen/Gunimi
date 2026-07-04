"use client";

import Link from "next/link";
import AiCore from "@/components/ui/AiCore";

// ─────────────────────────────────────────────────────────────
// LandingFooter — Simple. Premium. Nothing unnecessary.
// GDL v1.0: AiCore mark, correct bg, no Orbit references.
// ─────────────────────────────────────────────────────────────

const LINKS = [
  { label: "Features",  href: "#systems" },
  { label: "AI",        href: "#ai" },
  { label: "Pricing",   href: "#pricing" },
  { label: "Privacy",   href: "/privacy" },
  { label: "Terms",     href: "/terms" },
];

export default function LandingFooter() {
  return (
    <footer className="relative border-t border-white/[0.04] bg-[#05060A] px-6 py-12">
      {/* Subtle top ambient */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[200px]"
        style={{ background: "radial-gradient(ellipse at top center, rgba(109,91,255,0.05), transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* MAIN ROW */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

          {/* BRAND */}
          <div className="flex items-center gap-3">
            <AiCore size={28} showRings={false} showParticles={false} intensity="medium" />
            <div>
              <p className="text-[14px] font-semibold text-[#F7F8FC]">Gunimi</p>
              <p className="text-[11px] text-[#9AA3B2]/45">AI Workspace Operating System</p>
            </div>
          </div>

          {/* NAV LINKS */}
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-7 gap-y-2">
            {LINKS.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-[#9AA3B2]/55 transition-colors duration-200 hover:text-[#9AA3B2]"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-[#9AA3B2]/55 transition-colors duration-200 hover:text-[#9AA3B2]"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* GET STARTED */}
          <Link
            href="/register"
            className="
              hidden items-center gap-2 rounded-[10px]
              border border-[#6D5BFF]/[0.22] bg-[rgba(109,91,255,0.08)]
              px-4 py-2 text-[13px] font-medium text-[#A998FF]
              transition-all duration-300 hover:border-[#6D5BFF]/[0.35] hover:bg-[rgba(109,91,255,0.14)]
              md:flex
            "
          >
            Get started
          </Link>
        </div>

        {/* BOTTOM ROW */}
        <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.04] pt-8 text-[12px] text-[#9AA3B2]/35 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Gunimi. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/login"     className="transition-colors hover:text-[#9AA3B2]/60">Sign in</Link>
            <Link href="/register"  className="transition-colors hover:text-[#9AA3B2]/60">Get started</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
