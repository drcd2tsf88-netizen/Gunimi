"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import { updateWorkspacePreferences } from "@/server/actions/workspace/updateWorkspacePreferences";
import type { WorkspacePreferences } from "@/server/actions/workspace/getWorkspaceSettings";

import GunimiCard from "@/components/ui/GunimiCard";
import GunimiField from "@/components/ui/GunimiField";
import GunimiButton from "@/components/ui/GunimiButton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CURRENCIES = [
  { value: "EUR", label: "EUR — Euro" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "CZK", label: "CZK — Czech Koruna" },
  { value: "PLN", label: "PLN — Polish Złoty" },
  { value: "HUF", label: "HUF — Hungarian Forint" },
  { value: "CHF", label: "CHF — Swiss Franc" },
];

const TIMEZONES = [
  { value: "Europe/Bratislava", label: "Europe/Bratislava (CET)" },
  { value: "Europe/Prague", label: "Europe/Prague (CET)" },
  { value: "Europe/Vienna", label: "Europe/Vienna (CET)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (CET)" },
  { value: "Europe/London", label: "Europe/London (GMT)" },
  { value: "Europe/Paris", label: "Europe/Paris (CET)" },
  { value: "Europe/Warsaw", label: "Europe/Warsaw (CET)" },
  { value: "America/New_York", label: "America/New York (EST)" },
  { value: "America/Los_Angeles", label: "America/Los Angeles (PST)" },
  { value: "America/Chicago", label: "America/Chicago (CST)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GST)" },
  { value: "UTC", label: "UTC" },
];

const DATE_FORMATS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  { value: "D MMM YYYY", label: "D MMM YYYY" },
];

type Props = {
  preferences: WorkspacePreferences | null;
  currentUserRole: string;
};

export default function PreferencesSection({ preferences, currentUserRole }: Props) {
  const t = useTranslations("settings");
  const router = useRouter();

  const [currency, setCurrency] = useState(preferences?.currency ?? "EUR");
  const [timezone, setTimezone] = useState(preferences?.timezone ?? "Europe/Bratislava");
  const [dateFormat, setDateFormat] = useState(preferences?.dateFormat ?? "DD/MM/YYYY");
  const [isPending, startTransition] = useTransition();

  const canEdit = ["owner", "admin"].includes(currentUserRole);

  function handleSave() {
    startTransition(async () => {
      const ok = await updateWorkspacePreferences({ currency, timezone, dateFormat });

      if (ok) {
        toast.success(t("preferencesSaved"));
        router.refresh();
      } else {
        toast.error(t("failedToSavePreferences"));
      }
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          {t("nav_preferences")}
        </p>
        <h2 className="mt-1.5 text-xl font-semibold">{t("preferencesTitle")}</h2>
        <p className="mt-1 text-sm text-white/40">{t("preferencesSubtitle")}</p>
      </div>

      <GunimiCard className="p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <GunimiField label={t("language")}>
            <div className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3">
              <span className="flex-1 text-sm text-white/25">{t("languageComingSoon")}</span>
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                {t("comingSoon")}
              </span>
            </div>
          </GunimiField>

          <GunimiField label={t("currency")}>
            <Select value={currency} onValueChange={setCurrency} disabled={!canEdit || isPending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </GunimiField>

          <GunimiField label={t("timezone")}>
            <Select value={timezone} onValueChange={setTimezone} disabled={!canEdit || isPending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </GunimiField>

          <GunimiField label={t("dateFormat")}>
            <Select value={dateFormat} onValueChange={setDateFormat} disabled={!canEdit || isPending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_FORMATS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </GunimiField>
        </div>

        {canEdit && (
          <div className="mt-6 flex justify-end">
            <GunimiButton onClick={handleSave} loading={isPending}>
              {isPending ? t("saving") : t("saveChanges")}
            </GunimiButton>
          </div>
        )}
      </GunimiCard>
    </div>
  );
}
