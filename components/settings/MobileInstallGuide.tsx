"use client";

import { Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MobileInstallGuide() {
  const t = useTranslations("settings");

  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Smartphone size={13} className="text-white/40" />
        <p className="text-[12px] font-medium text-white/60">{t("mobileInstallTitle")}</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="shrink-0 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
            {t("mobileInstallAndroidLabel")}
          </span>
          <p className="text-[11px] text-white/40">{t("mobileInstallAndroid")}</p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="shrink-0 rounded-md border border-sky-500/20 bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-medium text-sky-400">
            {t("mobileInstallIOSLabel")}
          </span>
          <p className="text-[11px] text-white/40">{t("mobileInstallIOS")}</p>
        </div>
      </div>

      <p className="text-[10px] text-white/25">{t("mobileInstallHint")}</p>
    </div>
  );
}
