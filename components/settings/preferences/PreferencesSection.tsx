"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import { updateWorkspacePreferences } from "@/server/actions/workspace/updateWorkspacePreferences";
import type { WorkspacePreferences } from "@/server/actions/workspace/getWorkspaceSettings";

import GunimiCard from "@/components/ui/GunimiCard";
import GunimiField from "@/components/ui/GunimiField";
import GunimiButton from "@/components/ui/GunimiButton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUPPORTED_LANGUAGES = ["en", "sk", "cs"] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

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
  { value: "Europe/Prague",     label: "Europe/Prague (CET)" },
  { value: "Europe/Vienna",     label: "Europe/Vienna (CET)" },
  { value: "Europe/Berlin",     label: "Europe/Berlin (CET)" },
  { value: "Europe/London",     label: "Europe/London (GMT)" },
  { value: "Europe/Paris",      label: "Europe/Paris (CET)" },
  { value: "Europe/Warsaw",     label: "Europe/Warsaw (CET)" },
  { value: "America/New_York",  label: "America/New York (EST)" },
  { value: "America/Los_Angeles", label: "America/Los Angeles (PST)" },
  { value: "America/Chicago",   label: "America/Chicago (CST)" },
  { value: "Asia/Dubai",        label: "Asia/Dubai (GST)" },
  { value: "UTC",               label: "UTC" },
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

  const canEdit = ["owner", "admin"].includes(currentUserRole);

  // ── Language & AI state ──────────────────────────────────────
  const [language, setLanguage] = useState<SupportedLanguage>(
    (preferences?.language as SupportedLanguage) ?? "en"
  );
  const [aiLanguage, setAiLanguage] = useState(preferences?.aiLanguage ?? "follow");
  const [isLangPending, startLangTransition] = useTransition();

  // ── Regional state ───────────────────────────────────────────
  const [currency, setCurrency]           = useState(preferences?.currency         ?? "EUR");
  const [timezone, setTimezone]           = useState(preferences?.timezone         ?? "Europe/Bratislava");
  const [dateFormat, setDateFormat]       = useState(preferences?.dateFormat       ?? "DD/MM/YYYY");
  const [timeFormat, setTimeFormat]       = useState<"12h" | "24h">(preferences?.timeFormat   ?? "24h");
  const [numberFormat, setNumberFormat]   = useState<"dot" | "comma">(preferences?.numberFormat ?? "dot");
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<"monday" | "sunday">(
    preferences?.firstDayOfWeek ?? "monday"
  );
  const [isRegionalPending, startRegionalTransition] = useTransition();

  function buildPrefs(): WorkspacePreferences {
    return {
      ...preferences,
      language,
      aiLanguage,
      currency,
      timezone,
      dateFormat,
      timeFormat,
      numberFormat,
      firstDayOfWeek,
    };
  }

  function handleSaveLanguage() {
    startLangTransition(async () => {
      const ok = await updateWorkspacePreferences(buildPrefs());
      if (ok) {
        document.cookie = `GUNIMI_LOCALE=${language}; path=/; max-age=31536000; SameSite=Lax`;
        toast.success(t("preferencesSaved"));
        window.location.reload();
      } else {
        toast.error(t("failedToSavePreferences"));
      }
    });
  }

  function handleSaveRegional() {
    startRegionalTransition(async () => {
      const ok = await updateWorkspacePreferences(buildPrefs());
      if (ok) {
        toast.success(t("preferencesSaved"));
        router.refresh();
      } else {
        toast.error(t("failedToSavePreferences"));
      }
    });
  }

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          {t("nav_preferences")}
        </p>
        <h2 className="mt-1.5 text-xl font-semibold">{t("preferencesTitle")}</h2>
        <p className="mt-1 text-sm text-white/40">{t("preferencesSubtitle")}</p>
      </div>

      {/* ── LANGUAGE ─────────────────────────────────────────── */}
      <section aria-labelledby="language-heading">
        <div className="mb-4">
          <h3 id="language-heading" className="text-[15px] font-semibold text-white">
            {t("languageTitle")}
          </h3>
          <p className="mt-0.5 text-sm text-white/40">{t("languageSubtitle")}</p>
        </div>

        <GunimiCard className="p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <GunimiField label={t("workspaceLanguage")}>
              <Select
                value={language}
                onValueChange={(v) => setLanguage(v as SupportedLanguage)}
                disabled={!canEdit || isLangPending}
              >
                <SelectTrigger aria-label={t("workspaceLanguage")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {t(`lang_${lang}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </GunimiField>

            <GunimiField label={t("aiLanguage")}>
              <Select
                value={aiLanguage}
                onValueChange={setAiLanguage}
                disabled={!canEdit || isLangPending}
              >
                <SelectTrigger aria-label={t("aiLanguage")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="follow">{t("aiLanguageFollow")}</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>{t("languageTitle")}</SelectLabel>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {t(`lang_${lang}`)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </GunimiField>
          </div>

          {canEdit && (
            <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/[0.05] pt-4">
              <p className="flex items-center gap-1.5 text-xs text-white/30">
                <RefreshCw size={11} className="shrink-0" />
                {t("workspaceLanguageNote")}
              </p>
              <GunimiButton onClick={handleSaveLanguage} loading={isLangPending}>
                {isLangPending ? t("saving") : t("saveChanges")}
              </GunimiButton>
            </div>
          )}
        </GunimiCard>
      </section>

      {/* ── REGIONAL ─────────────────────────────────────────── */}
      <section aria-labelledby="regional-heading">
        <div className="mb-4">
          <h3 id="regional-heading" className="text-[15px] font-semibold text-white">
            {t("regionalTitle")}
          </h3>
          <p className="mt-0.5 text-sm text-white/40">{t("regionalSubtitle")}</p>
        </div>

        <GunimiCard className="p-6">
          <div className="grid gap-5 sm:grid-cols-2">

            <GunimiField label={t("timezone")}>
              <Select
                value={timezone}
                onValueChange={setTimezone}
                disabled={!canEdit || isRegionalPending}
              >
                <SelectTrigger aria-label={t("timezone")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </GunimiField>

            <GunimiField label={t("currency")}>
              <Select
                value={currency}
                onValueChange={setCurrency}
                disabled={!canEdit || isRegionalPending}
              >
                <SelectTrigger aria-label={t("currency")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </GunimiField>

            <GunimiField label={t("dateFormat")}>
              <Select
                value={dateFormat}
                onValueChange={setDateFormat}
                disabled={!canEdit || isRegionalPending}
              >
                <SelectTrigger aria-label={t("dateFormat")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_FORMATS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </GunimiField>

            <GunimiField label={t("timeFormat")}>
              <Select
                value={timeFormat}
                onValueChange={(v) => setTimeFormat(v as "12h" | "24h")}
                disabled={!canEdit || isRegionalPending}
              >
                <SelectTrigger aria-label={t("timeFormat")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">{t("timeFormat_24h")}</SelectItem>
                  <SelectItem value="12h">{t("timeFormat_12h")}</SelectItem>
                </SelectContent>
              </Select>
            </GunimiField>

            <GunimiField label={t("numberFormat")}>
              <Select
                value={numberFormat}
                onValueChange={(v) => setNumberFormat(v as "dot" | "comma")}
                disabled={!canEdit || isRegionalPending}
              >
                <SelectTrigger aria-label={t("numberFormat")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dot">{t("numberFormat_dot")}</SelectItem>
                  <SelectItem value="comma">{t("numberFormat_comma")}</SelectItem>
                </SelectContent>
              </Select>
            </GunimiField>

            <GunimiField label={t("firstDayOfWeek")}>
              <Select
                value={firstDayOfWeek}
                onValueChange={(v) => setFirstDayOfWeek(v as "monday" | "sunday")}
                disabled={!canEdit || isRegionalPending}
              >
                <SelectTrigger aria-label={t("firstDayOfWeek")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">{t("firstDayOfWeek_monday")}</SelectItem>
                  <SelectItem value="sunday">{t("firstDayOfWeek_sunday")}</SelectItem>
                </SelectContent>
              </Select>
            </GunimiField>

          </div>

          {canEdit && (
            <div className="mt-6 flex justify-end border-t border-white/[0.05] pt-4">
              <GunimiButton onClick={handleSaveRegional} loading={isRegionalPending}>
                {isRegionalPending ? t("saving") : t("saveChanges")}
              </GunimiButton>
            </div>
          )}
        </GunimiCard>
      </section>

    </div>
  );
}
