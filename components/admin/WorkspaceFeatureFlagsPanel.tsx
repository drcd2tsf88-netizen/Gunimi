"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { setWorkspaceFeatureFlag } from "@/server/actions/admin/platformActions";
import { KNOWN_FEATURE_FLAGS, FLAG_KEYS } from "@/lib/admin/featureFlags";

type Props = {
  workspaceId: string;
  featureFlags: Record<string, boolean>;
};

function FlagToggle({
  workspaceId,
  flagKey,
  initialValue,
}: {
  workspaceId: string;
  flagKey: string;
  initialValue: boolean;
}) {
  const meta = KNOWN_FEATURE_FLAGS[flagKey as keyof typeof KNOWN_FEATURE_FLAGS];
  const [value, setValue] = useState(initialValue);
  const [pending, start] = useTransition();

  function toggle() {
    const next = !value;
    start(async () => {
      await setWorkspaceFeatureFlag(workspaceId, flagKey, next);
      setValue(next);
    });
  }

  if (!meta) return null;

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="min-w-0">
        <p className="text-xs font-medium text-white/70">{meta.label}</p>
        <p className="text-[11px] text-white/30">{meta.description}</p>
      </div>
      <button
        onClick={toggle}
        disabled={pending}
        role="switch"
        aria-checked={value}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 transition-colors focus-visible:outline-none disabled:opacity-50 ${
          value
            ? "border-violet-500/60 bg-violet-500/30"
            : "border-white/[0.12] bg-white/[0.05]"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-3.5 w-3.5 translate-y-[-1px] rounded-full shadow transition-transform ${
            value ? "translate-x-4 bg-violet-300" : "translate-x-0 bg-white/30"
          }`}
        />
      </button>
    </div>
  );
}

export default function WorkspaceFeatureFlagsPanel({ workspaceId, featureFlags }: Props) {
  const t = useTranslations("admin");

  return (
    <tr>
      <td colSpan={5} className="bg-white/[0.01] px-6 pb-4 pt-2">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
            {t("flagsTitle")}
          </p>
          <div className="divide-y divide-white/[0.04]">
            {FLAG_KEYS.map((key) => {
              const defaultOn = KNOWN_FEATURE_FLAGS[key].defaultOn;
              const val = key in featureFlags ? featureFlags[key] : defaultOn;
              return (
                <FlagToggle
                  key={key}
                  workspaceId={workspaceId}
                  flagKey={key}
                  initialValue={val}
                />
              );
            })}
          </div>
        </div>
      </td>
    </tr>
  );
}
