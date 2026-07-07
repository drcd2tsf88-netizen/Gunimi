"use client";

import { motion }
from "framer-motion";

import { cn }
from "@/lib/utils";

type GunimiSkeletonProps = {
  className?: string;
};

export default function GunimiSkeleton({
  className = "",
}: GunimiSkeletonProps) {
  return (
    <motion.div
      animate={{
        opacity: [0.4, 0.65, 0.4],
      }}
      transition={{
        duration: 2.4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={cn(
        `
          group
          relative

          overflow-hidden

          rounded-2xl

          border
          border-white/[0.05]

          bg-white/[0.025]

          backdrop-blur-2xl
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
          via-white/10
          to-transparent
        "
      />

      {/* AMBIENT */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          bg-[radial-gradient(circle_at_top,rgba(109,91,255,0.06),transparent_50%)]
        "
      />

      {/* SHIMMER */}

      <motion.div
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          inset-y-0

          w-1/2

          bg-gradient-to-r
          from-transparent
          via-white/[0.04]
          to-transparent
        "
      />
    </motion.div>
  );
}