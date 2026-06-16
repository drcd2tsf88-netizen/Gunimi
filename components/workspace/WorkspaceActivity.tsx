"use client";

import {
  motion,
} from "framer-motion";

import OrbitCard
from "@/components/ui/OrbitCard";

import type { WorkspaceActivity } from "@/types/activity";

type Props = {
  activity: WorkspaceActivity[];
};

export default function WorkspaceActivity({
  activity,
}: Props) {
  return (
    <section
      className="
        space-y-6
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              text-[10px]
              uppercase

              tracking-[0.18em]

              text-violet-300
            "
          >
            Workspace Observatory
          </p>

          <h2
            className="
              mt-2

              text-2xl
              font-semibold

              tracking-tight
            "
          >
            Activity Timeline
          </h2>
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
            py-1.5

            text-[10px]
            uppercase

            tracking-[0.16em]

            text-emerald-300
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

                bg-emerald-400/40
              "
            />

            <div
              className="
                relative

                h-2
                w-2

                rounded-full

                bg-emerald-400
              "
            />
          </div>

          Live Activity
        </div>
      </div>

      {/* TIMELINE */}

      <div
        className="
          space-y-4
        "
      >
        {activity.map(
          (
            item,
            index
          ) => (
            <motion.div
              key={item.id}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay:
                  index * 0.06,
              }}
            >
              <OrbitCard
                className="
                  p-5
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-4
                  "
                >
                  {/* ICON */}

                  <div
                    className="
                      relative

                      flex
                      h-10
                      w-10

                      shrink-0

                      items-center
                      justify-center

                      rounded-xl

                      border
                      border-white/[0.08]

                      bg-white/[0.03]
                    "
                  >
                    <div
                      className="
                        absolute

                        h-2
                        w-2

                        rounded-full

                        bg-violet-400
                      "
                    />

                    <div
                      className="
                        absolute

                        h-2
                        w-2

                        animate-ping

                        rounded-full

                        bg-violet-400/40
                      "
                    />

                    <span
                      className="
                        text-[10px]
                        font-semibold

                        text-violet-300
                      "
                    >
                      AI
                    </span>
                  </div>

                  {/* CONTENT */}

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                      "
                    >
                      <h3
                        className="
                          text-sm
                          font-medium
                        "
                      >
                        Workspace Activity
                      </h3>

                      <p
                        className="
                          text-[11px]
                          text-zinc-500
                        "
                      >
                        {new Date(
                          item.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <p
                      className="
                        mt-3

                        text-sm
                        leading-relaxed

                        text-zinc-400
                      "
                    >
                      {item.message}
                    </p>
                  </div>
                </div>
              </OrbitCard>
            </motion.div>
          )
        )}
      </div>
    </section>
  );
}