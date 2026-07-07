"use client";

import { Tabs } from "radix-ui";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// GunimiWorkspaceTabs — Foundation component for all workspace
// types. Handles tab navigation, ARIA, keyboard access, and
// mobile scroll. Labels and content are always external.
//
// Radix UI Tabs provides: role="tablist/tab/tabpanel",
// aria-selected, aria-controls, id pairs, and full keyboard
// navigation (Arrow keys, Home, End) at no cost.
// ─────────────────────────────────────────────────────────────

export type WorkspaceTab = {
  id: string;
  label: string;
  content: React.ReactNode;
  /** Optional count badge — renders when value > 0 */
  badge?: number;
};

type Props = {
  tabs: WorkspaceTab[];
  /** Default active tab id. Falls back to first tab. */
  defaultTab?: string;
  /**
   * aria-label for the tab list — describes which workspace this
   * belongs to (e.g. "Deal navigation"). Optional; accessibility
   * is maintained without it via Radix semantics.
   */
  listLabel?: string;
  className?: string;
};

export default function GunimiWorkspaceTabs({
  tabs,
  defaultTab,
  listLabel,
  className,
}: Props) {
  const initialTab = defaultTab ?? tabs[0]?.id ?? "";

  return (
    <Tabs.Root defaultValue={initialTab} className={cn("w-full", className)}>
      {/* ── TAB BAR ──────────────────────────────────────────── */}
      <div className="relative mb-6">
        {/* Top sheen — titanium edge catch, matches GunimiCard */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        <Tabs.List
          aria-label={listLabel}
          className={cn(
            // L1 surface — matches GunimiCard material
            "relative flex items-center gap-1 overflow-x-auto",
            "rounded-[14px] border border-white/[0.055]",
            "bg-[#0A0E17]",
            "p-1",
            "shadow-[0_4px_20px_rgba(109,91,255,0.06),0_0_0_1px_rgba(255,255,255,0.02)]",
            // Prevent scrollbar flash on iOS
            "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]",
          )}
        >
          {tabs.map((tab) => (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              className={cn(
                // Layout
                "group relative flex shrink-0 items-center gap-2",
                "rounded-[10px] px-4 py-2",
                // Typography
                "text-[13px] font-medium",
                // Base state
                "text-[#9AA3B2]/60",
                // Transitions
                "outline-none transition-all duration-200",
                // Hover
                "hover:text-[#C8CDD8]",
                // Keyboard focus ring — GDL violet
                "focus-visible:ring-2 focus-visible:ring-[#6D5BFF]/50",
                "focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0E17]",
                // Active — L3 surface lift + full text brightness
                "data-[state=active]:bg-[#161E2E]",
                "data-[state=active]:text-[#F7F8FC]",
                "data-[state=active]:shadow-[0_2px_10px_rgba(109,91,255,0.10)]",
              )}
            >
              {tab.label}

              {/* Count badge — only when badge > 0 */}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  aria-label={`${tab.badge} items`}
                  className={cn(
                    "flex h-[18px] min-w-[18px] items-center justify-center",
                    "rounded-full px-1",
                    "text-[10px] font-semibold tabular-nums",
                    // Inactive state
                    "bg-white/[0.06] text-[#9AA3B2]/60",
                    // Active state — violet tint (parent has `group`)
                    "group-data-[state=active]:bg-[#6D5BFF]/20",
                    "group-data-[state=active]:text-[#8B7DFF]",
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </div>

      {/* ── TAB PANELS ──────────────────────────────────────── */}
      {tabs.map((tab) => (
        <Tabs.Content
          key={tab.id}
          value={tab.id}
          className={cn(
            "outline-none",
            // Panel focus ring (keyboard tab to content)
            "focus-visible:ring-2 focus-visible:ring-[#6D5BFF]/50",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060A]",
          )}
        >
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
