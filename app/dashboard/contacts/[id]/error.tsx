"use client";

import PageError from "@/components/ui/PageError";

export default function ContactDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <PageError reset={reset} />;
}
