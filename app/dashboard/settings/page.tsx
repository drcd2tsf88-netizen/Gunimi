"use client";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import { AlertTriangle } from "lucide-react";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitCard
from "@/components/ui/OrbitCard";

export default function SettingsPage() {
  const t = useTranslations("settings");

  const aiPreferencesItems = [
    {
      title: t("aiRecommendations"),
      description: t("aiRecommendationsDescription"),
      status: t("enabled"),
    },
    {
      title: t("workflowAutomation"),
      description: t("workflowAutomationDescription"),
      status: t("active"),
    },
    {
      title: t("smartInsights"),
      description: t("smartInsightsDescription"),
      status: t("enabled"),
    },
  ];

  const notificationItems = [
    {
      title: t("emailNotifications"),
      description: t("emailNotificationsDescription"),
      status: t("enabled"),
    },
    {
      title: t("aiActivityAlerts"),
      description: t("aiActivityAlertsDescription"),
      status: t("enabled"),
    },
    {
      title: t("crmUpdates"),
      description: t("crmUpdatesDescription"),
      status: t("silent"),
    },
  ];

  return (

    <div className="space-y-8">

      {/* Alpha Preview Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
        <p className="text-sm text-amber-300/80">
          <span className="font-semibold text-amber-300">{t("previewBannerTitle")} — </span>
          {t("previewBannerDescription")}
        </p>
      </div>

      {/* Hero */}
      <OrbitSection>

        <OrbitHeading

          badge={t("badge")}

          title={t("title")}

          subtitle={t("subtitle")}

        />

      </OrbitSection>

      {/* Profile */}
      <OrbitSection>

        <OrbitCard
          className="p-6"
        >

          <div

            className="

              flex
              flex-col
              gap-6

              xl:flex-row
              xl:items-center
              xl:justify-between

            "
          >

            <div
              className="flex items-center gap-5"
            >

              <div

                className="

                  flex
                  h-20
                  w-20

                  items-center
                  justify-center

                  rounded-full

                  bg-white

                  text-3xl
                  font-bold

                  text-black

                "
              >

                O

              </div>

              <div>

                <h2
                  className="text-xl font-semibold"
                >

                  {t("orbitUser")}

                </h2>

                <p
                  className="mt-2 text-zinc-400"
                >

                  {t("workspaceOwner")}

                </p>

              </div>

            </div>

            <button

              onClick={() =>

                toast(
                  t("profileEditingComingSoon")
                )

              }

              className="orbit-button"

            >

              {t("editProfile")}

            </button>

          </div>

        </OrbitCard>

      </OrbitSection>

      {/* Settings */}
      <OrbitSection>

        <div
          className="grid gap-6 xl:grid-cols-2"
        >

          {/* AI Preferences */}
          <OrbitCard
            className="p-6"
          >

            <div

              className="

                flex
                items-center
                justify-between

              "
            >

              <div>

                <h2
                  className="text-xl font-semibold"
                >

                  {t("aiPreferences")}

                </h2>

                <p
                  className="mt-2 text-zinc-400"
                >

                  {t("aiPreferencesSubtitle")}

                </p>

              </div>

              <div

                className="

                  rounded-full

                  border
                  border-violet-500/20

                  bg-violet-500/10

                  px-4
                  py-2

                  text-xs
                  text-violet-300

                "
              >

                {t("orbitAiLabel")}

              </div>

            </div>

            <div
              className="mt-8 space-y-4"
            >

              {aiPreferencesItems.map((item) => (

                <div

                  key={item.title}

                  className="

                    flex
                    items-center
                    justify-between

                    rounded-2xl

                    border
                    border-white/10

                    bg-white/[0.03]

                    p-5

                  "
                >

                  <div>

                    <h3
                      className="font-semibold"
                    >

                      {item.title}

                    </h3>

                    <p

                      className="

                        mt-1

                        text-sm
                        text-zinc-400

                      "
                    >

                      {item.description}

                    </p>

                  </div>

                  <div

                    className="

                      rounded-full

                      border
                      border-amber-500/30

                      bg-amber-500/10

                      px-4
                      py-2

                      text-sm
                      text-amber-300

                    "
                  >

                    {t("comingSoon")}

                  </div>

                </div>

              ))}

            </div>

          </OrbitCard>

          {/* Notifications */}
          <OrbitCard
            className="p-6"
          >

            <div

              className="

                flex
                items-center
                justify-between

              "
            >

              <div>

                <h2
                  className="text-xl font-semibold"
                >

                  {t("notifications")}

                </h2>

                <p
                  className="mt-2 text-zinc-400"
                >

                  {t("notificationsSubtitle")}

                </p>

              </div>

              <div

                className="

                  rounded-full

                  border
                  border-white/10

                  bg-white/[0.03]

                  px-4
                  py-2

                  text-xs
                  text-zinc-300

                "
              >

                {t("workspaceLabel")}

              </div>

            </div>

            <div
              className="mt-8 space-y-4"
            >

              {notificationItems.map((item) => (

                <div

                  key={item.title}

                  className="

                    flex
                    items-center
                    justify-between

                    rounded-2xl

                    border
                    border-white/10

                    bg-white/[0.03]

                    p-5

                  "
                >

                  <div>

                    <h3
                      className="font-semibold"
                    >

                      {item.title}

                    </h3>

                    <p

                      className="

                        mt-1

                        text-sm
                        text-zinc-400

                      "
                    >

                      {item.description}

                    </p>

                  </div>

                  <div

                    className="

                      rounded-full

                      border
                      border-amber-500/30

                      bg-amber-500/10

                      px-4
                      py-2

                      text-sm
                      text-amber-300

                    "
                  >

                    {t("comingSoon")}

                  </div>

                </div>

              ))}

            </div>

          </OrbitCard>

        </div>

      </OrbitSection>

    </div>

  );
}
