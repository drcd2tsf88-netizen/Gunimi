
"use client";

import { motion }
from "framer-motion";

import { cn }
from "@/lib/utils";

type OrbitCardProps = {
  children:
    React.ReactNode;

  className?: string;

  onClick?: () => void;
};

export default function OrbitCard({
  children,

  className = "",

  onClick,
}: OrbitCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.18,
        ease: "easeOut",
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

          backdrop-blur-2xl

          shadow-[0_0_20px_rgba(124,58,237,0.05)]

          transition-all
          duration-300

          hover:border-white/[0.14]

          hover:bg-white/[0.04]

          hover:shadow-[0_0_40px_rgba(124,58,237,0.08)]
        `,

        onClick &&
          `
            cursor-pointer
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

      {/* BORDER GLOW */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          rounded-2xl

          opacity-0

          transition-opacity
          duration-500

          group-hover:opacity-100

          shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]
        "
      />

      {/* CONTENT */}

      <div
        className="
          relative
          z-10
        "
      >
        {children}
      </div>
    </motion.div>
  );
}