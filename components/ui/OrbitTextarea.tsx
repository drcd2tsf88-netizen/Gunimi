import * as React
from "react";

import { cn }
from "@/lib/utils";

export type OrbitTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const OrbitTextarea =
  React.forwardRef<
    HTMLTextAreaElement,
    OrbitTextareaProps
  >(
    (
      {
        className,
        ...props
      },

      ref
    ) => {
      return (
        <div
          className="
            relative
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

          <textarea
            ref={ref}
            className={cn(
              `
              flex
              min-h-[120px]
              w-full

              rounded-xl

              border
              border-white/[0.08]

              bg-white/[0.025]

              px-4
              py-3.5

              text-sm
              leading-relaxed

              text-white

              placeholder:text-zinc-500

              backdrop-blur-2xl

              transition-all
              duration-300

              hover:border-white/[0.12]

              focus:border-violet-500/30
              focus:bg-white/[0.04]

              focus:outline-none

              disabled:cursor-not-allowed
              disabled:opacity-50

              resize-none
              `,

              className
            )}
            {...props}
          />
        </div>
      );
    }
  );

OrbitTextarea.displayName =
  "OrbitTextarea";

export default OrbitTextarea;