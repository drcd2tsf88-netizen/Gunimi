"use client";

import { useTranslations } from "next-intl";

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
  const t = useTranslations("analytics");

  const metrics = [

    {
      label: t("metricAiEfficiency"),
      value: "+28%",
      description: t("metricAiEfficiencyDesc"),
    },

    {
      label: t("metricCrmMomentum"),
      value: "+16%",
      description: t("metricCrmMomentumDesc"),
    },

    {
      label: t("metricWorkflowSpeed"),
      value: "4.2x",
      description: t("metricWorkflowSpeedDesc"),
    },

    {
      label: t("metricAiActions"),
      value: "12.4K",
      description: t("metricAiActionsDesc"),
    },

  ];

  const insights = [

    {
      title: t("insight1Title"),
      description: t("insight1Description"),
    },

    {
      title: t("insight2Title"),
      description: t("insight2Description"),
    },

    {
      title: t("insight3Title"),
      description: t("insight3Description"),
    },

  ];

  return (

    <div className="space-y-10">

      {/* Hero */}
      <OrbitSection>

        <OrbitHeading

          badge={t("badge")}

          title={t("title")}

          subtitle={t("subtitle")}

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

                {t("analysisActive")}

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

                {t("productivityAcceleration")}

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

                {t("productivityDescription")}

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

                {t("liveAiSignal")}

              </p>

              <h3

                className="

                  mt-4

                  text-2xl
                  font-bold
                  leading-snug

                "

              >

                {t("systemStability")}

              </h3>

              <div
                className="mt-8 space-y-4"
              >

                {

                  [
                    t("signalAiOperational"),
                    t("signalWorkspaceSync"),
                    t("signalAutomationOnline"),
                    t("signalPredictiveActive"),
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

                    {t("aiPerformanceObservatory")}

                  </h2>

                  <p
                    className="mt-2 text-zinc-400"
                  >

                    {t("realtimeIntelligence")}

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

                  {t("liveMonitoring")}

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

    badge={t("predictiveBadge")}

    title={t("predictiveTitle")}

    subtitle={t("predictiveSubtitle")}

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
          title: t("prediction1Title"),
          prediction: "72%",
          description: t("prediction1Description"),
          status: t("prediction1Status"),
        },

        {
          title: t("prediction2Title"),
          prediction: "+24%",
          description: t("prediction2Description"),
          status: t("prediction2Status"),
        },

        {
          title: t("prediction3Title"),
          prediction: "3 Active",
          description: t("prediction3Description"),
          status: t("prediction3Status"),
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

    badge={t("autonomousBadge")}

    title={t("autonomousTitle")}

    subtitle={t("autonomousSubtitle")}

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
          title: t("plan1Title"),
          description: t("plan1Description"),
          actions: [
            t("plan1Action1"),
            t("plan1Action2"),
            t("plan1Action3"),
          ],
        },

        {
          title: t("plan2Title"),
          description: t("plan2Description"),
          actions: [
            t("plan2Action1"),
            t("plan2Action2"),
            t("plan2Action3"),
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

                {t("autonomousReady")}

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

                  {t("orbitAiInsights")}

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

                  {t("aiLive")}

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
