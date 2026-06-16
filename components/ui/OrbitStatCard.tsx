"use client";

import {
  motion,
} from "framer-motion";

import CountUp
from "react-countup";

import {
  LucideIcon,
} from "lucide-react";

import { cn }
from "@/lib/utils";

type OrbitStatCardProps = {
  title: string;

  value:
    | string
    | number;

  description?: string;

  icon: LucideIcon;

  animated?: boolean;

  className?: string;
};

export default function OrbitStatCard({
  title,
  value,
  description,
  icon: Icon,
  animated = false,
  className,
}: OrbitStatCardProps) {
  const isNumeric =
    typeof value ===
    "number";

  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.18,
      }}
      className={cn(
        `
        group
        relative

        overflow-hidden

        rounded-2xl

        border
        border-white/[0.08]

        bg-white/[0.025]

        p-5

        backdrop-blur-2xl

        shadow-[0_0_20px_rgba(124,58,237,0.05)]

        transition-all
        duration-300

        hover:border-white/[0.14]

        hover:bg-white/[0.04]

        hover:shadow-[0_0_40px_rgba(124,58,237,0.08)]
        `,
        className
      )}
    >
      {/* TOP LIGHT */}

      <div
        className="
          pointer-events-none

          absolute
          inset-x-0
          top-0

          h-px

          bg-gradient-to-r
          from-transparent
          via-white/20
          to-transparent
        "
      />

      {/* AMBIENT */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          opacity-0

          transition-opacity
          duration-500

          group-hover:opacity-100

          bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.10),transparent_40%)]
        "
      />

      {/* CONTENT */}

      <div
        className="
          relative
          z-10
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          {/* TEXT */}

          <div
            className="
              min-w-0
              flex-1
            "
          >
            <p
              className="
                text-[11px]
                uppercase

                tracking-[0.18em]

                text-zinc-500
              "
            >
              {title}
            </p>

            <h3
              className="
                mt-4

                break-words

                text-3xl
                font-semibold

                tracking-tight

                text-white
              "
            >
              {animated &&
              isNumeric ? (
                <CountUp
                  end={value}
                  duration={1.8}
                  separator=","
                />
              ) : (
                value
              )}
            </h3>
          </div>

          {/* ICON */}

          <div
            className="
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
            <Icon
              className="
                h-4
                w-4

                text-violet-300
              "
            />
          </div>
        </div>

        {/* DESCRIPTION */}

        {description && (
          <p
            className="
              mt-5

              text-sm
              leading-relaxed

              text-zinc-500
            "
          >
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}