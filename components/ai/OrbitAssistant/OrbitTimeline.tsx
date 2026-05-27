"use client";

import {
  motion,
} from "framer-motion";

type OrbitTimelineProps = {
  workflowTimeline:
    string[];
};

export default function OrbitTimeline({
  workflowTimeline,
}: OrbitTimelineProps) {
  if (
    workflowTimeline.length ===
    0
  ) {
    return null;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
    >
      <p
        className="
          mb-3

          text-[10px]
          uppercase

          tracking-[0.2em]

          text-zinc-500
        "
      >
        Execution Timeline
      </p>

      <div
        className="
          space-y-2
        "
      >
        {workflowTimeline.map(
          (
            step,
            index
          ) => (
            <motion.div
              key={`${step}-${index}`}
              initial={{
                opacity: 0,
                x: -6,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay:
                  index * 0.08,
              }}
              className="
                flex
                items-start
                gap-3
              "
            >
              {/* NODE */}

              <motion.div
                animate={{
                  scale: [
                    1,
                    1.2,
                    1,
                  ],

                  opacity: [
                    0.6,
                    1,
                    0.6,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat:
                    Infinity,

                  delay:
                    index * 0.2,
                }}
                className="
                  mt-1

                  flex
                  h-3
                  w-3

                  items-center
                  justify-center
                "
              >
                <div
                  className="
                    absolute

                    h-3
                    w-3

                    rounded-full

                    bg-violet-400/20
                  "
                />

                <div
                  className="
                    relative

                    h-1.5
                    w-1.5

                    rounded-full

                    bg-violet-300
                  "
                />
              </motion.div>

              {/* STEP */}

              <div
                className="
                  flex-1

                  rounded-xl

                  border
                  border-white/10

                  bg-white/[0.03]

                  px-3
                  py-2.5

                  text-xs
                  text-zinc-300
                "
              >
                {step}
              </div>
            </motion.div>
          )
        )}
      </div>
    </motion.div>
  );
}