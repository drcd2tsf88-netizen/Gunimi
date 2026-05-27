"use client";

import {
  motion,
} from "framer-motion";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitCard
from "@/components/ui/OrbitCard";

export default function AnalyticsPage() {

  const metrics = [

    {
      label:
        "AI Efficiency",

      value:
        "+28%",

      description:
        "Workspace acceleration",
    },

    {
      label:
        "CRM Momentum",

      value:
        "+16%",

      description:
        "Lead engagement growth",
    },

    {
      label:
        "Workflow Speed",

      value:
        "4.2x",

      description:
        "Automation performance",
    },

    {
      label:
        "AI Actions",

      value:
        "12.4K",

      description:
        "System executions",
    },

  ];

  const insights = [

    {
      title:
        "Productivity acceleration detected",

      description:
        "Orbit AI identified elevated execution efficiency across active workspace systems.",
    },

    {
      title:
        "CRM conversion momentum increasing",

      description:
        "Lead engagement performance improved during the last automation cycle.",
    },

    {
      title:
        "AI workflow optimization recommended",

      description:
        "Orbit AI suggests automating repetitive workspace operations.",
    },

  ];

  return (

    <div className="space-y-10">

      {/* Hero */}
      <OrbitSection>

        <OrbitHeading

          badge="AI Observatory"

          title="Orbit Intelligence Analytics"

          subtitle="
            Realtime AI-powered workspace intelligence,
            predictive productivity monitoring and
            autonomous business analysis.
          "

        />

        {/* Observatory Grid */}
        <div

          className="

            mt-10

            grid
            gap-6

            lg:grid-cols-3

          "

        >

          {/* Main Intelligence */}
          <OrbitCard
            className="relative overflow-hidden p-8 lg:col-span-2"
          >

            {/* Glow */}
            <div

              className="

                pointer-events-none

                absolute
                right-[-120px]
                top-[-120px]

                h-[280px]
                w-[280px]

                rounded-full

                bg-violet-500/10

                blur-3xl

              "

            />

            <div className="relative z-10">

              <div

                className="

                  inline-flex
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-violet-500/20

                  bg-violet-500/10

                  px-3
                  py-1

                  text-xs
                  text-violet-300

                "

              >

                <motion.div

                  animate={{

                    scale: [1, 1.4, 1],
                    opacity: [0.5, 1, 0.5],

                  }}

                  transition={{

                    duration: 2,
                    repeat: Infinity,

                  }}

                  className="

                    h-2
                    w-2

                    rounded-full

                    bg-violet-400

                  "

                />

                Orbit AI Analysis Active

              </div>

              <h2

                className="

                  mt-6

                  max-w-2xl

                  text-4xl
                  font-bold
                  leading-tight

                "

              >

                Productivity acceleration
                detected across workspace systems.

              </h2>

              <p

                className="

                  mt-5

                  max-w-2xl

                  text-base
                  leading-relaxed
                  text-zinc-400

                "

              >

                Orbit AI identified increased workflow
                efficiency, CRM engagement growth and
                elevated automation execution performance.

              </p>

              {/* Metrics */}
              <div

                className="

                  mt-10

                  grid
                  gap-4

                  md:grid-cols-2
                  xl:grid-cols-4

                "

              >

                {

                  metrics.map((item) => (

                    <div

                      key={item.label}

                      className="

                        rounded-2xl

                        border
                        border-white/10

                        bg-white/[0.03]

                        p-5

                        backdrop-blur-xl

                      "

                    >

                      <p
                        className="text-sm text-zinc-500"
                      >

                        {item.label}

                      </p>

                      <h3

                        className="

                          mt-3

                          text-3xl
                          font-bold

                        "

                      >

                        {item.value}

                      </h3>

                      <p

                        className="

                          mt-2

                          text-sm
                          text-zinc-400

                        "

                      >

                        {item.description}

                      </p>

                    </div>

                  ))

                }

              </div>

            </div>

          </OrbitCard>

          {/* AI Signal */}
          <OrbitCard
            className="relative overflow-hidden p-6"
          >

            <div

              className="

                pointer-events-none

                absolute
                bottom-[-80px]
                left-[-80px]

                h-[220px]
                w-[220px]

                rounded-full

                bg-cyan-500/10

                blur-3xl

              "

            />

            <div className="relative z-10">

              <p
                className="text-sm text-cyan-300"
              >

                Live AI Signal

              </p>

              <h3

                className="

                  mt-4

                  text-2xl
                  font-bold
                  leading-snug

                "

              >

                System stability
                operating normally.

              </h3>

              <div
                className="mt-8 space-y-4"
              >

                {

                  [

                    "AI systems operational",

                    "Workspace sync stable",

                    "Automation engine online",

                    "Predictive analysis active",

                  ].map((signal) => (

                    <div

                      key={signal}

                      className="

                        flex
                        items-center
                        gap-3

                      "

                    >

                      <motion.div

                        animate={{

                          scale: [1, 1.3, 1],

                          opacity: [0.5, 1, 0.5],

                        }}

                        transition={{

                          duration: 2,
                          repeat: Infinity,

                        }}

                        className="

                          h-2.5
                          w-2.5

                          rounded-full

                          bg-cyan-400

                        "

                      />

                      <span
                        className="text-sm text-zinc-300"
                      >

                        {signal}

                      </span>

                    </div>

                  ))

                }

              </div>

            </div>

          </OrbitCard>

        </div>

      </OrbitSection>

      {/* Analytics Grid */}
      <OrbitSection>

        <div
          className="grid gap-6 xl:grid-cols-3"
        >

          {/* Observatory Chart */}
          <OrbitCard
            className="relative overflow-hidden p-8 xl:col-span-2"
          >

            {/* Glow */}
            <div

              className="

                pointer-events-none

                absolute
                bottom-[-120px]
                right-[-120px]

                h-[260px]
                w-[260px]

                rounded-full

                bg-violet-500/10

                blur-3xl

              "

            />

            <div className="relative z-10">

              <div

                className="

                  flex
                  items-center
                  justify-between

                "

              >

                <div>

                  <h2
                    className="text-2xl font-semibold"
                  >

                    AI Performance Observatory

                  </h2>

                  <p
                    className="mt-2 text-zinc-400"
                  >

                    Realtime operational intelligence
                    across workspace systems.

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

                    text-sm
                    text-violet-300

                  "

                >

                  Live Monitoring

                </div>

              </div>

              {/* Chart */}
              <div

                className="

                  mt-14

                  flex
                  h-80
                  items-end
                  gap-5

                "

              >

                {

                  [42, 58, 49, 72, 65, 88, 96].map(

                    (height, index) => (

                      <motion.div

                        key={index}

                        initial={{
                          opacity: 0,
                          y: 20,
                        }}

                        animate={{
                          opacity: 1,
                          y: 0,
                        }}

                        transition={{
                          delay: index * 0.08,
                        }}

                        className="flex-1"

                      >

                        <motion.div

                          whileHover={{
                            y: -6,
                          }}

                          className="

                            relative

                            overflow-hidden

                            rounded-t-[28px]

                            bg-gradient-to-t
                            from-violet-500
                            to-cyan-400

                            shadow-[0_0_30px_rgba(124,58,237,0.25)]

                          "

                          style={{
                            height: `${height}%`,
                          }}

                        >

                          <div

                            className="

                              absolute
                              inset-0

                              bg-white/10

                            "

                          />

                        </motion.div>

                      </motion.div>

                    )

                  )

                }

              </div>

            </div>

          </OrbitCard>
          <OrbitSection>

  <OrbitHeading

    badge="Predictive Intelligence"

    title="Orbit AI Predictive Layer"

    subtitle="
      Autonomous AI prediction systems monitoring
      workspace behavior, productivity risks and
      future operational performance.
    "

  />

  <div

    className="

      mt-10

      grid
      gap-6

      xl:grid-cols-3

    "

  >

    {

      [

        {

          title:
            "Productivity slowdown probability",

          prediction:
            "72%",

          description:
            "Orbit AI predicts reduced execution efficiency within the next operational cycle.",

          status:
            "Moderate Risk",

        },

        {

          title:
            "CRM conversion acceleration",

          prediction:
            "+24%",

          description:
            "Lead engagement momentum indicates elevated conversion potential.",

          status:
            "Growth Signal",

        },

        {

          title:
            "Workflow bottleneck detected",

          prediction:
            "3 Active",

          description:
            "AI identified high-priority task congestion inside automation queues.",

          status:
            "Requires Attention",

        },

      ].map((item, index) => (

        <motion.div

          key={item.title}

          initial={{
            opacity: 0,
            y: 12,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: index * 0.08,
          }}

        >

          <OrbitCard
            className="relative overflow-hidden p-6"
          >

            {/* Ambient Glow */}
            <div

              className="

                pointer-events-none

                absolute
                right-[-80px]
                top-[-80px]

                h-[220px]
                w-[220px]

                rounded-full

                bg-violet-500/10

                blur-3xl

              "

            />

            <div className="relative z-10">

              {/* Status */}
              <div

                className="

                  inline-flex
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-violet-500/20

                  bg-violet-500/10

                  px-3
                  py-1

                  text-xs
                  text-violet-300

                "

              >

                <motion.div

                  animate={{

                    scale: [1, 1.3, 1],

                    opacity: [0.5, 1, 0.5],

                  }}

                  transition={{

                    duration: 2,
                    repeat: Infinity,

                    delay: index * 0.2,

                  }}

                  className="

                    h-2
                    w-2

                    rounded-full

                    bg-violet-400

                  "

                />

                {item.status}

              </div>

              <h3

                className="

                  mt-6

                  text-xl
                  font-semibold
                  leading-snug

                "

              >

                {item.title}

              </h3>

              <div

                className="

                  mt-8

                  text-5xl
                  font-bold

                "

              >

                {item.prediction}

              </div>

              <p

                className="

                  mt-6

                  text-sm
                  leading-relaxed
                  text-zinc-400

                "

              >

                {item.description}

              </p>

            </div>

          </OrbitCard>

        </motion.div>

      ))

    }

  </div>

</OrbitSection>
<OrbitSection>

  <OrbitHeading

    badge="Autonomous Execution"

    title="Orbit AI Autonomous Actions"

    subtitle="
      AI-generated execution flows,
      intelligent recovery systems and
      autonomous operational assistance.
    "

  />

  <div

    className="

      mt-10

      grid
      gap-6

      xl:grid-cols-2

    "

  >

    {

      [

        {

          title:
            "Workflow Recovery Plan",

          description:
            "Orbit AI detected operational slowdown and prepared a recovery execution strategy.",

          actions: [

            "Redistribute high-priority tasks",

            "Generate AI productivity summary",

            "Optimize automation queue",

          ],

        },

        {

          title:
            "CRM Momentum Optimization",

          description:
            "Orbit AI identified elevated engagement potential inside the CRM pipeline.",

          actions: [

            "Generate follow-up workflows",

            "Prioritize high-conversion leads",

            "Prepare AI outreach summary",

          ],

        },

      ].map((item, index) => (

        <motion.div

          key={item.title}

          initial={{
            opacity: 0,
            y: 14,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: index * 0.08,
          }}

        >

          <OrbitCard
            className="relative overflow-hidden p-8"
          >

            {/* Glow */}
            <div

              className="

                pointer-events-none

                absolute
                right-[-100px]
                top-[-100px]

                h-[240px]
                w-[240px]

                rounded-full

                bg-violet-500/10

                blur-3xl

              "

            />

            <div className="relative z-10">

              {/* Status */}
              <div

                className="

                  inline-flex
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-violet-500/20

                  bg-violet-500/10

                  px-3
                  py-1

                  text-xs
                  text-violet-300

                "

              >

                <motion.div

                  animate={{

                    scale: [1, 1.3, 1],

                    opacity: [0.5, 1, 0.5],

                  }}

                  transition={{

                    duration: 2,
                    repeat: Infinity,

                  }}

                  className="

                    h-2
                    w-2

                    rounded-full

                    bg-violet-400

                  "

                />

                Autonomous Execution Ready

              </div>

              <h2

                className="

                  mt-6

                  text-2xl
                  font-bold

                "

              >

                {item.title}

              </h2>

              <p

                className="

                  mt-5

                  text-sm
                  leading-relaxed
                  text-zinc-400

                "

              >

                {item.description}

              </p>

              {/* Actions */}
              <div
                className="mt-8 space-y-4"
              >

                {

                  item.actions.map((action) => (

                    <motion.button

                      key={action}

                      whileHover={{
                        y: -2,
                      }}

                      whileTap={{
                        scale: 0.98,
                      }}

                      className="

                        flex
                        w-full
                        items-center
                        justify-between

                        rounded-2xl

                        border
                        border-white/10

                        bg-white/[0.03]

                        px-5
                        py-4

                        text-left
                        text-sm
                        text-zinc-300

                        transition-all
                        duration-300

                        hover:border-violet-500/20
                        hover:bg-violet-500/10
                        hover:text-white

                      "

                    >

                      <span>
                        {action}
                      </span>

                      <span>
                        →
                      </span>

                    </motion.button>

                  ))

                }

              </div>

            </div>

          </OrbitCard>

        </motion.div>

      ))

    }

  </div>

</OrbitSection>

          {/* AI Insights */}
          <OrbitCard
            className="relative overflow-hidden p-6"
          >

            {/* Glow */}
            <div

              className="

                pointer-events-none

                absolute
                top-[-80px]
                right-[-80px]

                h-[220px]
                w-[220px]

                rounded-full

                bg-violet-500/10

                blur-3xl

              "

            />

            <div className="relative z-10">

              <div

                className="

                  flex
                  items-center
                  justify-between

                "

              >

                <h2
                  className="text-2xl font-semibold"
                >

                  Orbit AI Insights

                </h2>

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

                  AI LIVE

                </div>

              </div>

              <div
                className="mt-8 space-y-4"
              >

                {

                  insights.map((item, index) => (

                    <motion.div

                      key={item.title}

                      initial={{
                        opacity: 0,
                        y: 10,
                      }}

                      animate={{
                        opacity: 1,
                        y: 0,
                      }}

                      transition={{
                        delay: index * 0.08,
                      }}

                      className="

                        rounded-2xl

                        border
                        border-white/10

                        bg-white/[0.03]

                        p-5

                        backdrop-blur-xl

                      "

                    >

                      <div
                        className="flex gap-4"
                      >

                        <motion.div

                          animate={{

                            scale: [1, 1.3, 1],

                            opacity: [0.5, 1, 0.5],

                          }}

                          transition={{

                            duration: 2,
                            repeat: Infinity,

                            delay: index * 0.2,

                          }}

                          className="

                            mt-1

                            h-2.5
                            w-2.5

                            rounded-full

                            bg-violet-400

                          "

                        />

                        <div>

                          <h3

                            className="

                              text-sm
                              font-medium
                              text-white

                            "

                          >

                            {item.title}

                          </h3>

                          <p

                            className="

                              mt-3

                              text-sm
                              leading-relaxed
                              text-zinc-400

                            "

                          >

                            {item.description}

                          </p>

                        </div>

                      </div>

                    </motion.div>

                  ))

                }

              </div>

            </div>

          </OrbitCard>

        </div>

      </OrbitSection>

    </div>

  );

}