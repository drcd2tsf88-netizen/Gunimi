"use client";

import PageError from "@/components/ui/PageError";

export default function DealsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <PageError reset={reset} />;
}
