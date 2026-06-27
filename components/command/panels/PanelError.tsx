"use client";

interface PanelErrorProps {
  message: string;
}

export function PanelError({ message }: PanelErrorProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="
        mx-4
        mt-1
        rounded-xl
        border
        border-red-500/20
        bg-red-500/5
        px-4
        py-3
      "
    >
      <p className="text-sm text-red-400">{message}</p>
    </div>
  );
}
