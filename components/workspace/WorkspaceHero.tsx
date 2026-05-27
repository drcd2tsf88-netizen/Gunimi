"use client";

import {
  motion,
} from "framer-motion";

import OrbitCard
from "@/components/ui/OrbitCard";

type Props = {
  company: any;
};

export default function WorkspaceHero({
  company,
}: Props) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        relative
      "
    >
      <OrbitCard
        className="
          overflow-hidden

          p-8
        "
      >
        {/* AMBIENT */}

        <div
          className="
            pointer-events-none

            absolute
            right-[-120px]
            top-[-120px]

            h-[260px]
            w-[260px]

            rounded-full

            bg-violet-500/10

            blur-3xl
          "
        />

        <div
          className="
            relative
            z-10

            flex
            flex-col
            gap-8

            xl:flex-row
            xl:items-center
            xl:justify-between
          "
        >
          {/* LEFT */}

          <div
            className="
              max-w-3xl
            "
          >
            {/* BADGE */}

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
                py-1.5

                text-[10px]
                uppercase

                tracking-[0.18em]

                text-violet-300
              "
            >
              <div
                className="
                  relative

                  flex
                  h-2
                  w-2
                "
              >
                <div
                  className="
                    absolute
                    inset-0

                    animate-ping

                    rounded-full

                    bg-violet-400/40
                  "
                />

                <div
                  className="
                    relative

                    h-2
                    w-2

                    rounded-full

                    bg-violet-400
                  "
                />
              </div>

              Orbit Workspace
            </div>

            {/* TITLE */}

            <h1
              className="
                mt-5

                text-4xl
                font-semibold

                tracking-tight
              "
            >
              {company?.name}
            </h1>

            {/* SUBTITLE */}

            <p
              className="
                mt-3

                text-sm
                leading-relaxed

                text-zinc-400
              "
            >
              {company?.industry ||
                "AI-powered operational workspace systems."}
            </p>

            {/* STATUS STRIP */}

            <div
              className="
                mt-6

                flex
                flex-wrap
                gap-3
              "
            >
              <div
                className="
                  inline-flex
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-white/[0.08]

                  bg-white/[0.03]

                  px-3
                  py-2

                  text-xs
                "
              >
                Workspace Synced
              </div>

              <div
                className="
                  inline-flex
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-emerald-500/20

                  bg-emerald-500/10

                  px-3
                  py-2

                  text-xs

                  text-emerald-300
                "
              >
                AI Systems Online
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <button
            className="
              group
              relative

              inline-flex
              items-center
              justify-center

              overflow-hidden

              rounded-2xl

              border
              border-violet-500/20

              bg-violet-500/10

              px-6
              py-4

              text-sm
              font-medium

              text-violet-200

              transition-all
              duration-300

              hover:border-violet-500/30
              hover:bg-violet-500/15
            "
          >
            <div
              className="
                pointer-events-none

                absolute
                inset-0

                opacity-0

                transition-opacity
                duration-500

                group-hover:opacity-100

                bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.16),transparent_45%)]
              "
            />

            <span
              className="
                relative
                z-10
              "
            >
              Launch Orbit AI
            </span>
          </button>
        </div>
      </OrbitCard>
    </motion.section>
  );
}