"use client";

import PageError from "@/components/ui/PageError";

export default function EmailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <PageError reset={reset} />;
}
