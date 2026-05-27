"use client";

import toast from "react-hot-toast";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitCard
from "@/components/ui/OrbitCard";

export default function AIPage() {

  const suggestions = [

    "Summarize workspace activity",

    "Analyze CRM performance",

    "Generate productivity insights",

    "Find workflow bottlenecks",

    "Optimize task management",

    "Create AI business summary",

  ];

  return (

    <div className="space-y-8">

      {/* Hero */}
      <OrbitSection>

        <OrbitHeading

          badge="Orbit AI Assistant"

          title="AI Command Center"

          subtitle="
            Interact with Orbit AI
            to analyze workspace activity,
            optimize workflows and generate
            intelligent business insights.
          "

        />

      </OrbitSection>

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
                border-violet-500/20

                bg-violet-500/10

                px-4
                py-2

                text-xs
                text-violet-300

              "
            >

              Orbit AI Online

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

                  ORBIT AI

                </p>

                <p

                  className="

                    mt-5

                    leading-relaxed

                    text-zinc-300

                  "
                >

                  Welcome to OrbitDesk
                  AI Command Center.

                  Workspace systems
                  operational.

                  Analytics synchronized
                  successfully.

                  Awaiting instructions.

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

                  USER

                </p>

                <p
                  className="mt-5 text-white"
                >

                  Analyze workspace
                  productivity and recommend
                  improvements.

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

                  ORBIT AI RESPONSE

                </p>

                <div

                  className="

                    mt-6

                    space-y-4

                    text-zinc-300

                  "
                >

                  <p>

                    Workspace productivity
                    currently stable at 87%.

                  </p>

                  <p>

                    CRM response delays
                    detected in customer
                    follow-up pipeline.

                  </p>

                  <div
                    className="pt-2"
                  >

                    <p
                      className="mb-4"
                    >

                      Recommended actions:

                    </p>

                    <ul

                      className="

                        space-y-3

                        text-sm
                        text-zinc-400

                      "
                    >

                      <li>
                        → Automate repetitive workflows
                      </li>

                      <li>
                        → Prioritize overdue CRM conversations
                      </li>

                      <li>
                        → Optimize task assignment distribution
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

                placeholder="
                  Ask Orbit AI anything...
                "

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
                    "AI integration coming soon"
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

                Execute

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

              AI Suggestions

            </h2>

            <p
              className="mt-2 text-zinc-400"
            >

              Quick AI actions for
              workspace productivity.

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

            Smart Prompts

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
                  "AI actions updating soon"
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

                      Execute intelligent
                      workspace analysis.

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