"use client";

import PageError from "@/components/ui/PageError";

export default function DealDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <PageError reset={reset} />;
}
