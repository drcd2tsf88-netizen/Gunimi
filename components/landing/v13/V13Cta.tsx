"use client";

import { useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";

export function V13Cta() {
  const t = useTranslations("landing.v13.cta");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  return (
    <section className="relative px-6 md:px-10 py-[100px] border-t border-[rgba(255,255,255,.04)] overflow-hidden">
      {/* Ambient bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%,rgba(109,91,255,.06) 0%,transparent 60%)",
        }}
      />
      <div
        className="absolute inset-[-40px] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(109,91,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(109,91,255,.02) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%,black 10%,transparent 70%)",
        }}
      />

      <div ref={ref} className="max-w-[640px] mx-auto text-center relative z-[1]">
        {/* Stem */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="w-px h-14 mx-auto mb-8"
          style={{
            background:
              "linear-gradient(to bottom,transparent,rgba(109,91,255,.3))",
          }}
        />

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-black tracking-[-0.065em] leading-[0.9] text-[rgba(240,242,250,.55)] mb-4"
          style={{ fontSize: "clamp(36px,5.5vw,68px)" }}
        >
          {t("headingBefore")}{" "}
          <em
            className="not-italic"
            style={{
              background:
                "linear-gradient(135deg,#C4B5FF,#F0EEFF,#93E8F8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("headingHighlight")}
          </em>
          ?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[16px] text-[rgba(138,148,168,.5)] max-w-[360px] mx-auto mb-11 leading-[1.7] tracking-[-0.01em]"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <Link
            href="/register"
            className="inline-block px-14 py-[18px] rounded-[14px] bg-[#6D5BFF] text-white text-[16px] font-bold tracking-[-0.025em] mb-4 transition-all duration-250 hover:bg-[#8B7DFF] hover:-translate-y-0.5"
            style={{
              boxShadow:
                "0 0 0 1px rgba(109,91,255,.4),0 10px 44px rgba(109,91,255,.32),inset 0 1px 0 rgba(255,255,255,.1)",
            }}
          >
            {t("button")}
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-[11px] text-[rgba(138,148,168,.28)] tracking-[0.02em]"
        >
          {t("finePrint")}
        </motion.p>
      </div>
    </section>
  );
}
