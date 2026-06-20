"use client";

import { useTranslations } from "next-intl";

import { Sparkles, X } from "lucide-react";

type OrbitHeaderProps = {
  onClose: () => void;
};

export default function OrbitHeader({ onClose }: OrbitHeaderProps) {
  const t = useTranslations("aiPanel");

  return (
    <div
      className="
        relative z-10
        flex items-center justify-between
        border-b border-white/10
        bg-black/20
        px-4 py-4
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            flex h-11 w-11 items-center justify-center
            rounded-2xl
            border border-violet-500/20
            bg-violet-500/10
          "
        >
          <Sparkles className="h-4 w-4 text-violet-300" />
        </div>

        <div>
          <h2 className="text-sm font-semibold">{t("orbitAi")}</h2>
        </div>
      </div>

      <button
        onClick={onClose}
        className="
          flex h-9 w-9 items-center justify-center
          rounded-xl
          border border-white/10
          bg-white/[0.03]
          text-zinc-400
          transition-all
          hover:bg-white/[0.06] hover:text-white
        "
      >
        <X size={16} />
      </button>
    </div>
  );
}
