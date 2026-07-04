"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// OrbitButton — Gunimi primary action component.
//
// Primary: solid fill with ambient glow. Not just a tinted box.
// Secondary: Titanium Glass — barely visible, highly premium.
// Danger: contained red for destructive actions.
// ─────────────────────────────────────────────────────────────

type OrbitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export default function OrbitButton({
  children,
  className,
  loading,
  variant = "primary",
  disabled,
  ...props
}: OrbitButtonProps) {
  const variants: Record<NonNullable<OrbitButtonProps["variant"]>, string> = {
    primary: [
      "border-[#6D5BFF]/30 bg-[#6D5BFF]",
      "text-white font-medium",
      "shadow-[0_0_20px_rgba(109,91,255,0.35),0_4px_12px_rgba(109,91,255,0.25)]",
      "hover:bg-[#7B6BFF]",
      "hover:shadow-[0_0_32px_rgba(109,91,255,0.5),0_6px_18px_rgba(109,91,255,0.30)]",
      "active:scale-[0.98]",
    ].join(" "),

    secondary: [
      "border-white/[0.07] bg-[#0A0E17]",
      "text-[#F7F8FC]/75",
      "shadow-[0_2px_8px_rgba(109,91,255,0.06),0_0_0_1px_rgba(255,255,255,0.03)]",
      "hover:border-white/[0.12] hover:bg-[#0F1520]",
      "hover:text-[#F7F8FC]",
      "hover:shadow-[0_4px_16px_rgba(109,91,255,0.10),0_0_0_1px_rgba(255,255,255,0.05)]",
    ].join(" "),

    ghost: [
      "border-transparent bg-transparent",
      "text-[#9AA3B2]",
      "hover:border-white/[0.07] hover:bg-white/[0.03]",
      "hover:text-[#F7F8FC]",
    ].join(" "),

    danger: [
      "border-red-500/20 bg-red-500/10",
      "text-red-300",
      "hover:border-red-500/35 hover:bg-red-500/18",
    ].join(" "),
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "rounded-[11px]",
        "border",
        "px-4 py-2.5",
        "text-sm",
        "transition-all",
        "duration-[var(--g-duration-md,280ms)]",
        "disabled:cursor-not-allowed disabled:opacity-45",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[#6D5BFF]/50",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[#05060A]",
        variants[variant],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span
            className="inline-block h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent opacity-70"
          />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
