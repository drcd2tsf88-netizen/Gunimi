"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AiBrief } from "@/server/actions/today/getAiBrief";

type Props = {
  brief: AiBrief;
};

export default function AiBriefCard({ brief }: Props) {
  const t = useTranslations("today");

  return (
    <div className="rounded-2xl border border-violet-500/10 bg-violet-500/[0.04] p-4">
      <div className="mb-2 flex items-center gap-1.5">
        <Sparkles size={10} className="text-violet-400/60" />
        <span className="text-[9px] font-semibold uppercase tracking-widest text-violet-400/60">
          {t("briefLabel")}
        </span>
      </div>
      <p className="text-[13px] leading-relaxed text-white/55">{brief.text}</p>
    </div>
  );
}
