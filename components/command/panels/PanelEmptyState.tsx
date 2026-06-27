"use client";

interface PanelEmptyStateProps {
  hint: string;
  backHint: string;
}

export function PanelEmptyState({ hint, backHint }: PanelEmptyStateProps) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        gap-3
        px-4
        py-10
        text-center
      "
    >
      <p className="text-sm text-white/25">{hint}</p>
      <p className="text-xs text-zinc-600">{backHint}</p>
    </div>
  );
}
