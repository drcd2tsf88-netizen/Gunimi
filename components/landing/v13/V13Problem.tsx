"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";

const CARDS = [
  { numKey: "01", titleKey: "card1Title", descKey: "card1Desc", delay: 0.05 },
  { numKey: "02", titleKey: "card2Title", descKey: "card2Desc", delay: 0.1 },
  { numKey: "03", titleKey: "card3Title", descKey: "card3Desc", delay: 0.15 },
] as const;

export function V13Problem() {
  const t = useTranslations("landing.v13.problem");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="px-6 md:px-10 pt-14 pb-20">
      <div ref={ref} className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-[10px] font-bold tracking-[0.2em] uppercase text-[rgba(61,69,88,.8)] mb-12"
        >
          {t("eyebrow")}
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-px rounded-[20px] overflow-hidden border border-[rgba(255,255,255,.04)]"
          style={{ background: "rgba(255,255,255,.04)" }}
        >
          {CARDS.map(({ numKey, titleKey, descKey, delay }) => (
            <motion.div
              key={numKey}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay }}
              className="bg-[#07090F] px-8 py-9"
            >
              <div className="text-[11px] font-bold tracking-[0.15em] text-[rgba(109,91,255,.3)] mb-5">
                {numKey}
              </div>
              <div className="text-[16px] font-bold text-[rgba(240,242,250,.75)] mb-2.5 tracking-[-0.03em] leading-[1.2]">
                {t(titleKey)}
              </div>
              <div className="text-[13px] text-[rgba(138,148,168,.55)] leading-[1.7] tracking-[-0.01em]">
                {t(descKey)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
