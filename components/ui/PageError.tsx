"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  reset: () => void;
}

export default function PageError({ reset }: Props) {
  const t = useTranslations("public.error");

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-red-500/[0.14] bg-red-500/[0.06]">
        <AlertTriangle size={24} className="text-red-400/70" />
      </div>

      <h2 className="mt-5 text-[18px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
        {t("headline")}
      </h2>

      <p className="mt-2 max-w-[380px] text-[14px] leading-relaxed text-[#9AA3B2]">
        {t("description")}
      </p>

      <button
        onClick={reset}
        className="mt-6 flex items-center gap-2 rounded-[10px] border border-[#6D5BFF]/30 bg-[#6D5BFF] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_0_16px_rgba(109,91,255,0.30)] transition-all duration-200 hover:bg-[#7B6BFF]"
      >
        <RotateCcw size={13} />
        {t("tryAgain")}
      </button>
    </div>
  );
}
