"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight, Building2, TrendingUp, Users } from "lucide-react";
import GunimiCard from "@/components/ui/GunimiCard";

// ─────────────────────────────────────────────────────────────
// WorkspaceAwakening
//
// First-class product state for a workspace with no business
// data yet. Replaces Today until at least one company,
// contact, or deal exists.
//
// This is NOT an onboarding wizard. It is an invitation to
// the three places where understanding begins.
// ─────────────────────────────────────────────────────────────

function extractFirstName(displayName: string): string {
  return displayName.trim().split(/\s+/)[0] ?? displayName;
}

function getGreetingKey(): "greetingMorning" | "greetingAfternoon" | "greetingEvening" {
  const hour = new Date().getHours();
  if (hour < 12) return "greetingMorning";
  if (hour < 17) return "greetingAfternoon";
  return "greetingEvening";
}

type CardProps = {
  Icon: React.FC<{ size?: number; className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  href: string;
  delay: number;
  isInView: boolean;
  reduced: boolean;
};

function ActivationCard({ Icon, title, description, href, delay, isInView, reduced }: CardProps) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: reduced ? 0 : 14 }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.75,
                delay: reduced ? 0 : delay,
                ease: [0.16, 1, 0.3, 1],
              },
            }
          : {}
      }
    >
      <Link
        href={href}
        className="block h-full rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5BFF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060A]"
      >
        <GunimiCard hoverable className="group flex h-full flex-col gap-5 p-5">
          {/* Icon */}
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#6D5BFF]/[0.14] bg-[#6D5BFF]/[0.08] transition-colors duration-200 group-hover:border-[#6D5BFF]/30 group-hover:bg-[#6D5BFF]/[0.14]">
            <Icon size={15} strokeWidth={1.75} className="text-[#8B7DFF]" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="text-[14px] font-semibold leading-[1.3] tracking-[-0.01em] text-[#F7F8FC]">
              {title}
            </p>
            <p className="mt-2 text-[12px] leading-[1.65] text-white/40">
              {description}
            </p>
          </div>

          {/* Arrow */}
          <ArrowRight
            size={13}
            className="text-white/15 transition-colors duration-200 group-hover:text-[#8B7DFF]/70"
          />
        </GunimiCard>
      </Link>
    </motion.div>
  );
}

export default function WorkspaceAwakening({ displayName }: { displayName: string }) {
  const t = useTranslations("awakening");
  const tToday = useTranslations("today");
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  // Mark that this session saw the awakening state.
  // When the workspace transitions to active, the dashboard reads
  // this flag and shows the one-time "awakened" moment.
  useEffect(() => {
    sessionStorage.setItem("gunimi_awakening_pending", "1");
    sessionStorage.setItem("gunimi_first_signal_pending", "1");
  }, []);

  const firstName = extractFirstName(displayName);
  const greeting = tToday(getGreetingKey());

  const cards: Omit<CardProps, "delay" | "isInView" | "reduced">[] = [
    {
      Icon: Building2,
      title: t("company.title"),
      description: t("company.description"),
      href: "/dashboard/companies",
    },
    {
      Icon: Users,
      title: t("contact.title"),
      description: t("contact.description"),
      href: "/dashboard/contacts",
    },
    {
      Icon: TrendingUp,
      title: t("deal.title"),
      description: t("deal.description"),
      href: "/dashboard/deals",
    },
  ];

  return (
    <div ref={ref} className="space-y-5">

      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div
        className="pb-1"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
        animate={
          isInView
            ? { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
            : {}
        }
      >
        <p className="text-[13px] text-white/35">
          {greeting}, {firstName}.
        </p>
        <p className="mt-1.5 text-sm font-semibold tracking-[-0.01em] text-[#F7F8FC]">
          {t("heading")}
        </p>
        <p className="mt-0.5 text-sm text-white/40">
          {t("subheading")}
        </p>
      </motion.div>

      {/* ── Context ────────────────────────────────────────────── */}
      <motion.p
        className="text-[13px] leading-relaxed text-white/25"
        initial={{ opacity: 0 }}
        animate={
          isInView
            ? {
                opacity: 1,
                transition: { duration: 0.6, delay: shouldReduceMotion ? 0 : 0.18, ease: "easeOut" },
              }
            : {}
        }
      >
        {t("context")}
      </motion.p>

      {/* ── Activation Cards ───────────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <ActivationCard
            key={card.href}
            {...card}
            delay={0.28 + i * 0.1}
            isInView={isInView}
            reduced={!!shouldReduceMotion}
          />
        ))}
      </div>

    </div>
  );
}
