"use client";

import { useTranslations } from "next-intl";

import { AlertTriangle } from "lucide-react";

export default function AutomationsPage() {
  const t = useTranslations("automations");

  const automations = [
    {
      title: t("automation1Title"),
      description: t("automation1Description"),
      status: "Active",
    },
    {
      title: t("automation2Title"),
      description: t("automation2Description"),
      status: "Active",
    },
    {
      title: t("automation3Title"),
      description: t("automation3Description"),
      status: "Coming Soon",
    },
    {
      title: t("automation4Title"),
      description: t("automation4Description"),
      status: "Coming Soon",
    },
  ];

  return (
    <main className="text-white">

      {/* Alpha Preview Banner */}
      <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
        <p className="text-sm text-amber-300/80">
          <span className="font-semibold text-amber-300">{t("previewBannerTitle")} — </span>
          {t("previewBannerDescription")}
        </p>
      </div>

      {/* Header */}
      <div>

        <div className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-400">
          {t("badge")}
        </div>

        <h1 className="mt-6 text-5xl font-bold">
          {t("title")}
        </h1>

        <p className="mt-4 max-w-3xl text-xl text-zinc-400">
          {t("subtitle")}
        </p>

      </div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            {t("activeAutomations")}
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            2
          </h2>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            {t("aiWorkflows")}
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            4
          </h2>

        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <p className="text-zinc-500">
            {t("productivityBoost")}
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            +38%
          </h2>

        </div>

      </div>

      {/* Automation Cards */}
      <div className="mt-10 grid gap-6 xl:grid-cols-2">

        {automations.map((automation) => (
          <div
            key={automation.title}
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6"
          >

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                {automation.title}
              </h2>

              <span
                className={
                  automation.status === "Active"
                    ? "rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400"
                    : "rounded-full bg-yellow-500/20 px-4 py-2 text-sm text-yellow-400"
                }
              >
                {automation.status === "Active" ? t("statusActive") : t("statusComingSoon")}
              </span>

            </div>

            <p className="mt-6 leading-relaxed text-zinc-400">

              {automation.description}

            </p>

            <button
              className="mt-8 rounded-xl border border-zinc-700 px-6 py-3 transition hover:bg-zinc-800"
            >
              {t("configureAutomation")}
            </button>

          </div>
        ))}

      </div>

      {/* AI Automation Ideas */}
      <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            {t("suggestedWorkflows")}
          </h2>

          <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
            {t("orbitAi")}
          </span>

        </div>

        <div className="mt-8 grid gap-4">

          <div className="rounded-2xl border border-zinc-800 bg-black p-5">

            <p className="font-semibold">
              {t("suggestion1")}
            </p>

          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black p-5">

            <p className="font-semibold">
              {t("suggestion2")}
            </p>

          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black p-5">

            <p className="font-semibold">
              {t("suggestion3")}
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}