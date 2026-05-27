"use client";

import toast from "react-hot-toast";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitCard
from "@/components/ui/OrbitCard";

export default function SettingsPage() {

  return (

    <div className="space-y-8">

      {/* Hero */}
      <OrbitSection>

        <OrbitHeading

          badge="OrbitDesk Settings"

          title="Workspace Configuration"

          subtitle="
            Manage workspace preferences,
            AI behavior, integrations
            and security settings.
          "

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

                  Orbit User

                </h2>

                <p
                  className="mt-2 text-zinc-400"
                >

                  Workspace Owner

                </p>

              </div>

            </div>

            <button

              onClick={() =>

                toast(
                  "Profile editing coming soon"
                )

              }

              className="orbit-button"

            >

              Edit Profile

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

                  AI Preferences

                </h2>

                <p
                  className="mt-2 text-zinc-400"
                >

                  Configure Orbit AI behavior
                  and workspace intelligence.

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

                Orbit AI

              </div>

            </div>

            <div
              className="mt-8 space-y-4"
            >

              {[
                {
                  title:
                    "AI Recommendations",

                  description:
                    "Enable intelligent workspace suggestions.",

                  status:
                    "Enabled",
                },

                {
                  title:
                    "Workflow Automation",

                  description:
                    "Allow AI workflow optimization.",

                  status:
                    "Active",
                },

                {
                  title:
                    "Smart Insights",

                  description:
                    "Generate AI business analytics.",

                  status:
                    "Enabled",
                },

              ].map((item) => (

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

                      bg-green-500/20

                      px-4
                      py-2

                      text-sm
                      text-green-400

                    "
                  >

                    {item.status}

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

                  Notifications

                </h2>

                <p
                  className="mt-2 text-zinc-400"
                >

                  Control workspace alerts
                  and activity updates.

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

                Workspace

              </div>

            </div>

            <div
              className="mt-8 space-y-4"
            >

              {[
                {
                  title:
                    "Email Notifications",

                  description:
                    "Receive workspace updates by email.",

                  status:
                    "Enabled",
                },

                {
                  title:
                    "AI Activity Alerts",

                  description:
                    "Receive AI-generated productivity alerts.",

                  status:
                    "Enabled",
                },

                {
                  title:
                    "CRM Updates",

                  description:
                    "Customer pipeline notifications.",

                  status:
                    "Silent",
                },

              ].map((item) => (

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

                      bg-white/[0.08]

                      px-4
                      py-2

                      text-sm
                      text-white

                    "
                  >

                    {item.status}

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