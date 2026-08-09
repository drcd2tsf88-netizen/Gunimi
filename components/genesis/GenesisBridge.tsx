"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";

interface LineProps {
  children: React.ReactNode;
  delay: number;
  size: "large" | "small";
}

function Line({ children, delay, size }: LineProps) {
  const base = size === "large"
    ? "text-[22px] font-semibold leading-[1.2] tracking-[-0.025em] text-[var(--g-text)] md:text-[32px]"
    : "text-[16px] font-light leading-[1.75] text-[#9AA3B2] md:text-[18px]";

  return (
    <Reveal delay={delay} duration={0.75} y={14} className={base}>
      {children}
    </Reveal>
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
