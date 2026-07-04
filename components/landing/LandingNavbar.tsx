"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import AiCore from "@/components/ui/AiCore";
import LandingMobileNav from "@/components/landing/LandingMobileNav";

// ─────────────────────────────────────────────────────────────
// LandingNavbar — Fixed top bar. GDL v1.0 compliant.
// AiCore replaces the old Orbit icon. No old violet classes.
// ─────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Features",   href: "#systems" },
  { label: "AI",         href: "#ai" },
  { label: "Pricing",    href: "#pricing" },
];

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.04] bg-[#05060A]/80 backdrop-blur-[20px]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="Gunimi home">
            <AiCore size={28} showRings={false} showParticles={false} intensity="strong" />
            <div>
              <span className="block text-[15px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
                Gunimi
              </span>
              <span className="block text-[10.5px] text-[#9AA3B2]/50 tracking-[0.04em]">
                AI Workspace OS
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[13px] text-[#9AA3B2]/70 transition-colors duration-200 hover:text-[#F7F8FC]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="
                hidden rounded-[10px] border border-white/[0.07] bg-transparent
                px-4 py-2 text-[13px] font-medium text-[#9AA3B2]
                transition-all duration-200 hover:border-white/[0.12] hover:text-[#F7F8FC]
                md:flex
              "
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="
                flex items-center gap-1.5 rounded-[10px]
                border border-[#6D5BFF]/30 bg-[#6D5BFF]
                px-4 py-2 text-[13px] font-medium text-white
                shadow-[0_0_18px_rgba(109,91,255,0.35)]
                transition-all duration-300
                hover:bg-[#7B6BFF] hover:shadow-[0_0_28px_rgba(109,91,255,0.50)]
              "
            >
              Get started
            </Link>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="
                flex h-9 w-9 items-center justify-center
                rounded-[9px] border border-white/[0.07]
                bg-white/[0.025] text-[#9AA3B2] transition-colors
                hover:text-[#F7F8FC] md:hidden
              "
            >
              <Menu size={16} />
            </button>
          </div>
        </div>
      </header>

      <LandingMobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
