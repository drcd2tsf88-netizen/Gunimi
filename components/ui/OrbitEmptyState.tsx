import type { ReactNode } from "react";

import { motion } from "framer-motion";

import type { LucideIcon } from "lucide-react";

type OrbitEmptyStateProps = {
  title: string;
  description?: string;
  icon: LucideIcon;
  action?: ReactNode;
};

export default function OrbitEmptyState({
  title,
  description,
  icon: Icon,
  action,
}: OrbitEmptyStateProps) {
  return (
    <motion.div
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

        overflow-hidden

        rounded-2xl

        border
        border-white/[0.08]

        bg-white/[0.025]

        px-8
        py-14

        text-center

        backdrop-blur-2xl
      "
    >
      {/* AMBIENT */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.08),transparent_45%)]
        "
      />

      {/* CONTENT */}

      <div
        className="
          relative
          z-10

          flex
          flex-col
          items-center
        "
      >
        {/* ICON */}

        <div
          className="
            flex
            h-14
            w-14

            items-center
            justify-center

            rounded-2xl

            border
            border-white/10

            bg-white/[0.03]
          "
        >
          <Icon
            className="
              h-5
              w-5

              text-violet-300
            "
          />
        </div>

        {/* TITLE */}

        <h3
          className="
            mt-5

            text-lg
            font-semibold
          "
        >
          {title}
        </h3>

        {/* DESCRIPTION */}

        {description && (
          <p
            className="
              mt-3

              max-w-sm

              text-sm
              leading-relaxed

              text-zinc-500
            "
          >
            {description}
          </p>
        )}

        {/* ACTION */}

        {action && (
          <div className="mt-6">
            {action}
          </div>
        )}
      </div>
    </motion.div>
  );
}