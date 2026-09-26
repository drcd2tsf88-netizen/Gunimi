"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  suggestion: string;
};

export default function NextActionDisplay({ suggestion }: Props) {
  const t = useTranslations("signalsPage");
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative rounded-2xl border border-[#6D5BFF]/20 bg-gradient-to-r from-[#6D5BFF]/[0.06] to-transparent px-5 py-4">
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            "linear-gradient(90deg, rgba(109,91,255,0.08) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <p className="text-sm leading-relaxed text-white/70">{suggestion}</p>
        <button
          onClick={() => setDismissed(true)}
          aria-label={t("dismiss")}
          className="mt-0.5 shrink-0 rounded-lg p-1 text-white/20 transition-colors hover:text-white/50"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
