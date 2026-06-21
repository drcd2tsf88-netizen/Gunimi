import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function EntityLink({ href, children, className }: Props) {
  return (
    <Link
      href={href}
      className={[
        "block rounded-xl border border-white/[0.08] bg-white/[0.02]",
        "transition-all hover:border-violet-500/20 hover:bg-white/[0.04]",
        "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Link>
  );
}
