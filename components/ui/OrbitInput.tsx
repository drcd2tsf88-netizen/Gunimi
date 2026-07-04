import * as React from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// OrbitInput — Titanium Glass input field.
// Focus ring glows with primary color. No hard borders.
// ─────────────────────────────────────────────────────────────

export type OrbitInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const OrbitInput = React.forwardRef<HTMLInputElement, OrbitInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        {/* Top edge sheen */}
        <div
          className="
            pointer-events-none absolute inset-x-0 top-0
            h-px
            bg-gradient-to-r from-transparent via-white/[0.06] to-transparent
          "
        />

        <input
          ref={ref}
          className={cn(
            "flex h-11 w-full",
            "rounded-[11px]",
            "border border-white/[0.06]",
            "bg-[#0A0E17]",
            "px-4",
            "text-sm text-[#F7F8FC]",
            "placeholder:text-[#9AA3B2]/55",
            "shadow-[0_2px_8px_rgba(109,91,255,0.05)]",
            "transition-all duration-[280ms]",
            // Hover
            "hover:border-white/[0.10]",
            // Focus — primary glow
            "focus:border-[#6D5BFF]/35",
            "focus:bg-[#0F1520]",
            "focus:shadow-[0_0_0_3px_rgba(109,91,255,0.12),0_2px_8px_rgba(109,91,255,0.08)]",
            "focus:outline-none",
            // Disabled
            "disabled:cursor-not-allowed disabled:opacity-45",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

OrbitInput.displayName = "OrbitInput";
export default OrbitInput;
