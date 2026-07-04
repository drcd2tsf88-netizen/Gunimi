"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import AiCore from "@/components/ui/AiCore";

// ─────────────────────────────────────────────────────────────
// LandingMobileNav — Slide-in nav drawer. GDL v1.0.
// ─────────────────────────────────────────────────────────────

type LandingMobileNavProps = {
  open: boolean;
  onClose: () => void;
};

const LINKS = [
  { label: "Features",  href: "#systems" },
  { label: "AI",        href: "#ai" },
  { label: "Pricing",   href: "#pricing" },
  { label: "Enterprise",href: "#enterprise" },
];

export default function LandingMobileNav({ open, onClose }: LandingMobileNavProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] bg-[#05060A]/80 backdrop-blur-[18px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col border-l border-white/[0.055] bg-[#05060A] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top sheen */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-[#6D5BFF]/20 via-transparent to-transparent" />

            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AiCore size={28} showRings={false} showParticles={false} intensity="strong" />
                <div>
                  <p className="text-[14px] font-semibold text-[#F7F8FC]">Gunimi</p>
                  <p className="text-[10.5px] text-[#9AA3B2]/45">AI Workspace OS</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-white/[0.07] bg-white/[0.025] text-[#9AA3B2] transition-colors hover:text-[#F7F8FC]"
              >
                <X size={16} />
              </button>
            </div>

            {/* LINKS */}
            <nav className="mt-10 flex flex-col gap-1.5">
              {LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="rounded-[12px] border border-transparent px-4 py-3.5 text-[14px] font-medium text-[#C8CDD8] transition-all duration-200 hover:border-white/[0.07] hover:bg-white/[0.03]"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* ACTIONS */}
            <div className="mt-auto space-y-3">
              <Link
                href="/login"
                onClick={onClose}
                className="flex h-12 w-full items-center justify-center rounded-[12px] border border-white/[0.08] bg-white/[0.03] text-[14px] font-medium text-[#9AA3B2] transition-all hover:border-white/[0.14] hover:text-[#F7F8FC]"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[12px] border border-[#6D5BFF]/30 bg-[#6D5BFF] text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(109,91,255,0.40)] transition-all hover:bg-[#7B6BFF]"
              >
                Get started
                <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
