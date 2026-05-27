"use client";

import {
  motion,
} from "framer-motion";

import {
  LucideIcon,
} from "lucide-react";

import CountUp
from "react-countup";

type OrbitStatCardProps = {
  title: string;

  value: string;

  description?: string;

  icon: LucideIcon;
};

export default function OrbitStatCard({
  title,

  value,

  description,

  icon: Icon,
}: OrbitStatCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.18,
      }}
      className="
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
      "
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
          "
        >
          {/* TEXT */}

          <div>
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

                text-3xl
                font-semibold

                tracking-tight

                text-white
              "
            >
              <CountUp
                end={Number(value)}
                duration={1.8}
                separator=","
              />
            </h3>
          </div>

          {/* ICON */}

          <div
            className="
              flex
              h-10
              w-10

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