"use client";

import * as React
from "react";

import { cn }
from "@/lib/utils";
import { useTranslations }
from "next-intl";

type OrbitButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;

    variant?:
      | "primary"
      | "secondary"
      | "danger";
  };

export default function OrbitButton({
  children,
  className,
  loading,
  variant = "primary",
  disabled,
  ...props
}: OrbitButtonProps) {
  const t =
    useTranslations();
  const variants: Record<
  NonNullable<
    OrbitButtonProps["variant"]
  >,
  string
> = {
    primary: `
      border-violet-500/20
      bg-violet-500/10
      text-violet-200

      hover:border-violet-500/30
      hover:bg-violet-500/15
    `,

    secondary: `
      border-white/[0.08]
      bg-white/[0.03]
      text-white/80

      hover:border-white/[0.12]
      hover:bg-white/[0.05]
    `,

    danger: `
      border-red-500/20
      bg-red-500/10
      text-red-300

      hover:border-red-500/30
      hover:bg-red-500/15
    `,
  };

  return (
    <button
  type="button"
  disabled={
    disabled ||
    loading
  }
  className={cn(
        `
        inline-flex
        items-center
        justify-center
        gap-2

        rounded-xl

        border

        px-4
        py-2.5

        text-sm
        font-medium

        transition-all
        duration-300

        disabled:cursor-not-allowed
        disabled:opacity-50
        `,
        variants[
          variant
        ],
        className
      )}
  {...props}
>
  {children}
      <OrbitButton loading>
  {t("common.create")}
</OrbitButton>
    </button>
  );
}