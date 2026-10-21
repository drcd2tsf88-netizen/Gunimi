"use client";

import { useTranslations } from "next-intl";
import { Bell, BellOff, BellRing } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import GunimiButton from "@/components/ui/GunimiButton";

export default function PushNotificationToggle() {
  const t = useTranslations("settings");
  const { status, subscribe, unsubscribe } = usePushNotifications();

  if (status === "loading" || status === "unsupported") {
    return (
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/80">{t("pushLabel")}</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            {status === "unsupported" ? t("pushUnsupported") : t("pushDescription")}
          </p>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/80">{t("pushLabel")}</p>
          <p className="mt-0.5 text-xs text-red-400/70">{t("pushDenied")}</p>
          <p className="mt-0.5 text-xs text-zinc-600">{t("pushDeniedHint")}</p>
        </div>
        <div className="shrink-0">
          <BellOff size={16} className="text-zinc-600" />
        </div>
      </div>
    );
  }

  if (status === "granted") {
    return (
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/80">{t("pushLabel")}</p>
          <p className="mt-0.5 text-xs text-emerald-400/70">{t("pushEnabled")}</p>
          <p className="mt-0.5 text-xs text-zinc-500">{t("pushDescription")}</p>
        </div>
        <div className="shrink-0">
          <GunimiButton
            variant="ghost"
            onClick={() => void unsubscribe()}
            className="text-xs text-zinc-500 hover:text-red-400"
          >
            <BellOff size={13} className="mr-1.5" />
            {t("pushDisable")}
          </GunimiButton>
        </div>
      </div>
    );
  }

  // status === "default"
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white/80">{t("pushLabel")}</p>
        <p className="mt-0.5 text-xs text-zinc-500">{t("pushDescription")}</p>
      </div>
      <div className="shrink-0">
        <GunimiButton
          variant="secondary"
          onClick={() => void subscribe()}
        >
          <Bell size={13} className="mr-1.5" />
          {t("pushEnable")}
        </GunimiButton>
      </div>
    </div>
  );
}
