"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronRight, LogOut, X } from "lucide-react";
import { useTranslations } from "next-intl";
import AiCore from "@/components/ui/AiCore";
import { isNavItemActive, type NavGroup } from "@/config/navigation";

// ─────────────────────────────────────────────────────────────
// SidebarNav
// ─────────────────────────────────────────────────────────────

export function SidebarNav({
  groups,
  pathname,
  t,
  collapsedGroups,
  onToggleGroup,
  onLinkClick,
}: {
  groups: NavGroup[];
  pathname: string;
  t: (key: string) => string;
  collapsedGroups: Set<string>;
  onToggleGroup: (id: string) => void;
  onLinkClick?: () => void;
}) {
  return (
    <div className="space-y-0.5">
      {groups.map((group, groupIndex) => {
        const isCollapsed = group.collapsible && collapsedGroups.has(group.id);
        return (
          <div
            key={group.id}
            className={
              group.separator
                ? "mt-4 border-t border-white/[0.04] pt-4"
                : groupIndex > 0
                ? "mt-0.5"
                : ""
            }
          >
            {group.labelKey && (
              group.collapsible ? (
                <button
                  type="button"
                  onClick={() => onToggleGroup(group.id)}
                  className="flex w-full items-center justify-between px-3 pb-1.5 pt-4"
                >
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#9AA3B2]/40">
                    {t(group.labelKey)}
                  </p>
                  {isCollapsed
                    ? <ChevronRight size={10} className="text-white/20" />
                    : <ChevronDown  size={10} className="text-white/20" />
                  }
                </button>
              ) : (
                <p className="px-3 pb-1.5 pt-4 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#9AA3B2]/40">
                  {t(group.labelKey)}
                </p>
              )
            )}

            {!isCollapsed && group.items.map((item) => {
              const Icon = item.icon;
              const active = isNavItemActive(pathname, item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onLinkClick}
                >
                  <div
                    className={[
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5",
                      "transition-all duration-[220ms]",
                      active
                        ? [
                            "bg-[#0F1520]",
                            "text-[#F7F8FC]",
                            "shadow-[inset_2px_0_0_#6D5BFF]",
                          ].join(" ")
                        : [
                            "text-[#9AA3B2]/65",
                            "hover:bg-white/[0.025]",
                            "hover:text-[#F7F8FC]/80",
                          ].join(" "),
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg",
                        "transition-colors duration-[220ms]",
                        active
                          ? "bg-[#6D5BFF]/12 text-[#8B7DFF]"
                          : "text-[#9AA3B2]/50 group-hover:text-[#9AA3B2]/80",
                      ].join(" ")}
                    >
                      <Icon size={14} strokeWidth={1.75} />
                    </div>

                    <span className="text-[13px] font-medium tracking-[-0.01em]">
                      {t(item.labelKey)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SidebarHeader
// ─────────────────────────────────────────────────────────────

export function SidebarHeader({
  onClose,
  workspaceName,
}: {
  onClose?: () => void;
  workspaceName?: string | null;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.04] px-4 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-9 w-9 shrink-0">
          <AiCore
            size={36}
            showRings={false}
            showParticles={false}
            intensity="strong"
          />
        </div>

        <div className="min-w-0">
          <h1 className="text-[13px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
            Gunimi
          </h1>
          {workspaceName ? (
            <p className="mt-px truncate text-[10px] font-medium tracking-[0.02em] text-[#9AA3B2]/65">
              {workspaceName}
            </p>
          ) : (
            <p className="mt-px text-[10px] tracking-[0.06em] text-[#9AA3B2]/45">
              AI Workspace OS
            </p>
          )}
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close navigation"
          className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-[#9AA3B2]/60 transition hover:text-white/80 lg:hidden"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SidebarFooter
// ─────────────────────────────────────────────────────────────

export function SidebarFooter({
  profile,
  onLinkClick,
  onSignOut,
}: {
  profile: { full_name: string; avatar_url: string | null } | null;
  onLinkClick?: () => void;
  onSignOut?: () => void;
}) {
  const tNav = useTranslations("nav");
  return (
    <div className="border-t border-white/[0.04] p-3">
      <div className="flex items-center gap-2">
        {/* Profile card */}
        <Link href="/dashboard/settings?section=profile" onClick={onLinkClick} className="min-w-0 flex-1">
          <div
            className="
              flex items-center gap-3 rounded-xl px-3 py-3
              border border-white/[0.04]
              bg-[#0A0E17]/60
              transition-all duration-[220ms]
              hover:border-[#6D5BFF]/15
              hover:bg-[#0F1520]
            "
          >
            <div
              className="
                relative flex h-8 w-8 shrink-0 items-center justify-center
                overflow-hidden rounded-lg
                bg-[#6D5BFF]/15 text-[12px] font-semibold text-[#8B7DFF]
              "
            >
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="" fill className="object-cover" />
              ) : (
                (profile?.full_name?.[0] ?? "G").toUpperCase()
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-medium text-[#F7F8FC]/75">
                {profile?.full_name ?? tNav("profileDefault")}
              </p>
              <p className="text-[10px] text-[#9AA3B2]/40">
                {tNav("profileSettings")}
              </p>
            </div>
          </div>
        </Link>

        {/* Sign out */}
        {onSignOut && (
          <button
            type="button"
            onClick={onSignOut}
            aria-label={tNav("logout")}
            title={tNav("logout")}
            className="
              flex h-[52px] w-[38px] shrink-0 items-center justify-center
              rounded-xl border border-white/[0.04] bg-[#0A0E17]/60
              text-[#9AA3B2]/40
              transition-all duration-[220ms]
              hover:border-red-500/[0.12] hover:bg-red-500/[0.05] hover:text-red-400/70
            "
          >
            <LogOut size={13} strokeWidth={1.75} />
          </button>
        )}
      </div>
    </div>
  );
}
