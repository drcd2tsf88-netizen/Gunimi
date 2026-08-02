"use client";

import PageError from "@/components/ui/PageError";

export default function CustomDashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <PageError reset={reset} />;
}
