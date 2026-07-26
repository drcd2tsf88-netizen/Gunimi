"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

// ── GenesisBridge ─────────────────────────────────────────────
// Compact context bridge between the hero and the email proof.
// Three plain statements, normal reading flow — NOT cinematic.
// Answers the only question a new visitor has after the hero:
// "OK but WHY do I need this?"
//
// Statement cadence:
//  1. Problem  — scattered information
//  2. Reality  — where it lives
//  3. Solution — Gunimi connects it
//
// Intentionally short. No scroll pacing. No vh gaps.
// A paragraph, not a performance.

interface LineProps {
  children: React.ReactNode;
  delay: number;
  size: "large" | "small";
}

function Line({ children, delay, size }: LineProps) {
  const shouldReduceMotion = useReducedMotion();

  const base = size === "large"
    ? "text-[22px] font-semibold leading-[1.2] tracking-[-0.025em] text-[var(--g-text)] md:text-[32px]"
    : "text-[16px] font-light leading-[1.75] text-[#9AA3B2] md:text-[18px]";

  if (shouldReduceMotion) return <p className={base}>{children}</p>;

  return (
    <motion.p
      className={base}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.p>
  );
}

export function GenesisBridge() {
  const t = useTranslations("landing.actI");

  return (
    <section className="mx-auto w-full max-w-[640px] px-6 py-20 md:px-8 md:py-28">
      <div className="flex flex-col gap-8">
        <Line delay={0} size="large">{t("statement1")}</Line>
        <Line delay={0.1} size="small">{t("statement2")}</Line>
        <Line delay={0.2} size="large">{t("statement3")}</Line>
      </div>
    </section>
  );
}
