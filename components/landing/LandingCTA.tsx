"use client";

import Link
from "next/link";

import {
  motion,
} from "framer-motion";

import {
  ArrowRight,
  Brain,
  Sparkles,
} from "lucide-react";

export default function LandingCTA() {
  return (
    <section
      id="enterprise"
      className="
        relative
        overflow-hidden

        px-6
        py-32
      "
    >
      {/* ATMOSPHERE */}

      <div
        className="
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* MAIN GLOW */}

        <div
          className="
            absolute
            left-1/2
            top-1/2

            h-[500px]
            w-[500px]

            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            bg-violet-500/12

            blur-[160px]
          "
        />

        {/* SECONDARY */}

        <div
          className="
            absolute
            bottom-[-120px]
            right-[-100px]

            h-[300px]
            w-[300px]

            rounded-full

            bg-cyan-500/10

            blur-[120px]
          "
        />

        {/* GRID */}

        <div
          className="
            absolute
            inset-0

            opacity-[0.03]

            [background-image:linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)]

            [background-size:72px_72px]
          "
        />
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.8,
        }}
        className="
          relative
          z-10

          mx-auto
          max-w-6xl
        "
      >
        <div
          className="
            relative
            overflow-hidden

            rounded-[42px]

            border
            border-white/10

            bg-white/[0.04]

            p-8

            backdrop-blur-2xl

            md:p-14
          "
        >
          {/* INTERNAL GLOW */}

          <div
            className="
              absolute
              inset-0

              bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.14),transparent_60%)]
            "
          />

          {/* CONTENT */}

          <div
            className="
              relative
              z-10

              text-center
            "
          >
            {/* BADGE */}

            <div
              className="
                mx-auto

                flex
                w-fit
                items-center
                gap-2

                rounded-full

                border
                border-violet-500/20

                bg-violet-500/10

                px-4
                py-2

                text-sm
                text-violet-200
              "
            >
              <Sparkles
                size={14}
              />

              Orbit AI Systems Online
            </div>

            {/* TITLE */}

            <h2
              className="
                mx-auto
                mt-10

                max-w-5xl

                text-5xl
                font-semibold
                leading-tight

                tracking-[-0.04em]

                md:text-7xl
              "
            >
              Enter the Future of
              <br />

              <span
                className="
                  bg-gradient-to-r
                  from-violet-300
                  via-white
                  to-cyan-300

                  bg-clip-text

                  text-transparent
                "
              >
                Autonomous Intelligence
              </span>
            </h2>

            {/* SUBTITLE */}

            <p
              className="
                mx-auto
                mt-8

                max-w-3xl

                text-lg
                leading-relaxed

                text-white/60
              "
            >
              OrbitDesk transforms
              your workspace into a
              living AI operating
              system powered by
              realtime cognition,
              autonomous orchestration,
              intelligent memory and
              execution awareness.
            </p>

            {/* LIVE AI SIGNAL */}

            <div
              className="
                mx-auto
                mt-10

                flex
                w-fit
                items-center
                gap-3

                rounded-2xl

                border
                border-cyan-500/20

                bg-cyan-500/[0.06]

                px-5
                py-4
              "
            >
              <div
                className="
                  relative
                "
              >
                <div
                  className="
                    h-2
                    w-2

                    rounded-full

                    bg-cyan-400
                  "
                />

                <div
                  className="
                    absolute
                    inset-0

                    animate-ping

                    rounded-full

                    bg-cyan-400/40
                  "
                />
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2

                  text-sm
                  text-cyan-100
                "
              >
                <Brain
                  size={16}
                />

                Orbit AI preparing
                workspace cognition
                systems
              </div>
            </div>

            {/* ACTIONS */}

            <div
              className="
                mt-14

                flex
                flex-col
                items-center
                justify-center
                gap-4

                sm:flex-row
              "
            >
              <Link
                href="/dashboard"
                className="
                  flex
                  items-center
                  gap-3

                  rounded-2xl

                  bg-violet-500

                  px-7
                  py-4

                  text-sm
                  font-medium

                  text-white

                  transition-all

                  hover:bg-violet-400
                "
              >
                Launch OrbitDesk

                <ArrowRight
                  size={16}
                />
              </Link>

              <a
                href="#systems"
                className="
                  rounded-2xl

                  border
                  border-white/10

                  bg-white/[0.03]

                  px-7
                  py-4

                  text-sm
                  font-medium

                  text-white/70

                  transition-all

                  hover:border-white/20
                  hover:bg-white/[0.05]
                "
              >
                Explore AI Systems
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}