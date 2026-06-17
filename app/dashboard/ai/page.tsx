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

export default function AIPage() {
  const t = useTranslations("ai");

  const suggestions = [
    t("suggestion1"),
    t("suggestion2"),
    t("suggestion3"),
    t("suggestion4"),
    t("suggestion5"),
    t("suggestion6"),
  ];

  return (

    <div className="space-y-8">

      {/* Hero */}
      <OrbitSection>

        <OrbitHeading

          badge={t("badge")}

          title={t("title")}

          subtitle={t("subtitle")}

        />

      </OrbitSection>

      {/* Alpha Preview Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
        <p className="text-sm text-amber-300/80">
          <span className="font-semibold text-amber-300">{t("previewBannerTitle")} — </span>
          {t("previewBannerDescription")}
        </p>
      </div>

      {/* AI Terminal */}
      <OrbitSection>

        <OrbitCard
          className="overflow-hidden p-0"
        >

          {/* Header */}
          <div

            className="

              flex
              items-center
              justify-between

              border-b
              border-white/10

              px-6
              py-5

            "
          >

            <div
              className="flex items-center gap-3"
            >

              <div
                className="
                  h-3
                  w-3
                  rounded-full
                  bg-red-500
                "
              />

              <div
                className="
                  h-3
                  w-3
                  rounded-full
                  bg-yellow-500
                "
              />

              <div
                className="
                  h-3
                  w-3
                  rounded-full
                  bg-green-500
                "
              />

            </div>

            <div

              className="

                rounded-full

                border
                border-amber-500/30

                bg-amber-500/10

                px-4
                py-2

                text-xs
                text-amber-300

              "
            >

              {t("alphaPreview")}

            </div>

          </div>

          {/* Content */}
          <div className="p-8">

            <div className="space-y-6">

              {/* AI Welcome */}
              <div

                className="

                  rounded-3xl

                  border
                  border-white/10

                  bg-white/[0.03]

                  p-6

                "
              >

                <p

                  className="

                    text-xs

                    uppercase

                    tracking-[0.3em]

                    text-zinc-500

                  "
                >

                  {t("orbitAi")}

                </p>

                <p

                  className="

                    mt-5

                    leading-relaxed

                    text-zinc-300

                  "
                >

                  {t("welcomeMessage")}

                </p>

              </div>

              {/* User */}
              <div

                className="

                  rounded-3xl

                  border
                  border-white/10

                  bg-white/[0.02]

                  p-6

                "
              >

                <p

                  className="

                    text-xs

                    uppercase

                    tracking-[0.3em]

                    text-zinc-500

                  "
                >

                  {t("user")}

                </p>

                <p
                  className="mt-5 text-white"
                >

                  {t("userMessage")}

                </p>

              </div>

              {/* AI Response */}
              <div

                className="

                  rounded-3xl

                  border
                  border-violet-500/10

                  bg-violet-500/[0.03]

                  p-6

                "
              >

                <p

                  className="

                    text-xs

                    uppercase

                    tracking-[0.3em]

                    text-violet-300

                  "
                >

                  {t("orbitAiResponse")}

                </p>

                <div

                  className="

                    mt-6

                    space-y-4

                    text-zinc-300

                  "
                >

                  <p>

                    {t("response1")}

                  </p>

                  <p>

                    {t("response2")}

                  </p>

                  <div
                    className="pt-2"
                  >

                    <p
                      className="mb-4"
                    >

                      {t("recommendedActions")}

                    </p>

                    <ul

                      className="

                        space-y-3

                        text-sm
                        text-zinc-400

                      "
                    >

                      <li>
                        {t("recommendedAction1")}
                      </li>

                      <li>
                        {t("recommendedAction2")}
                      </li>

                      <li>
                        {t("recommendedAction3")}
                      </li>

                    </ul>

                  </div>

                </div>

              </div>

            </div>

            {/* Input */}
            <div

              className="

                mt-10

                flex
                flex-col
                gap-4

                xl:flex-row

              "
            >

              <input

                type="text"

                placeholder={t("inputPlaceholder")}

                className="

                  h-[58px]
                  flex-1

                  rounded-2xl

                  border
                  border-white/10

                  bg-white/[0.03]

                  px-5

                  text-white

                  outline-none

                  placeholder:text-zinc-500

                "
              />

              <button

                onClick={() =>

                  toast(
                    t("integrationComingSoon")
                  )

                }

                className="

                  h-[58px]

                  rounded-2xl

                  border
                  border-violet-500/20

                  bg-violet-500/10

                  px-8

                  text-sm
                  font-medium
                  text-violet-200

                  transition-all
                  duration-300

                  hover:bg-violet-500/20

                "
              >

                {t("execute")}

              </button>

            </div>

          </div>

        </OrbitCard>

      </OrbitSection>

      {/* Suggestions */}
      <OrbitSection>

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

              {t("aiSuggestions")}

            </h2>

            <p
              className="mt-2 text-zinc-400"
            >

              {t("aiSuggestionsDescription")}

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

              text-sm
              text-zinc-300

            "
          >

            {t("smartPrompts")}

          </div>

        </div>

        <div
          className="mt-8 grid gap-6 xl:grid-cols-3"
        >

          {suggestions.map((item) => (

            <button

              key={item}

              onClick={() =>

                toast(
                  t("actionsComingSoon")
                )

              }

              className="text-left"

            >

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

                    <h3
                      className="font-semibold"
                    >

                      {item}

                    </h3>

                    <p

                      className="

                        mt-3

                        text-sm
                        text-zinc-400

                      "
                    >

                      {t("executeSuggestion")}

                    </p>

                  </div>

                  <span
                    className="text-zinc-500"
                  >

                    →

                  </span>

                </div>

              </OrbitCard>

            </button>

          ))}

        </div>

      </OrbitSection>

    </div>

  );
}
