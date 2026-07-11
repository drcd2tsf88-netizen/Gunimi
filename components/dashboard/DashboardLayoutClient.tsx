"use client";

import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronRight, X } from "lucide-react";

import { NAV_GROUPS, isNavItemActive, type NavGroup } from "@/config/navigation";

import OrbitCommand from "@/components/command/OrbitCommand";
import OrbitTopbar from "@/components/layout/OrbitTopbar";
import GunimiLoader from "@/components/system/GunimiLoader";
import AiCore from "@/components/ui/AiCore";

import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────
// SidebarNav
// ─────────────────────────────────────────────────────────────

function SidebarNav({
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
                            // Active: left indicator line + very subtle fill
                            "bg-[#0F1520]",
                            "text-[#F7F8FC]",
                            // Left accent via box-shadow (doesn't affect layout)
                            "shadow-[inset_2px_0_0_#6D5BFF]",
                          ].join(" ")
                        : [
                            "text-[#9AA3B2]/65",
                            "hover:bg-white/[0.025]",
                            "hover:text-[#F7F8FC]/80",
                          ].join(" "),
                    ].join(" ")}
                  >
                    {/* Icon */}
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

function SidebarHeader({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.04] px-4 py-4">
      <div className="flex items-center gap-3">
        {/* AI Core miniature — the Gunimi identity mark */}
        <div className="relative h-9 w-9 shrink-0">
          <AiCore
            size={36}
            showRings={false}
            showParticles={false}
            intensity="strong"
          />
        </div>

        <div>
          <h1 className="text-[13px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
            Gunimi
          </h1>
          <p className="mt-px text-[10px] tracking-[0.06em] text-[#9AA3B2]/45">
            AI Workspace OS
          </p>
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close navigation"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-[#9AA3B2]/60 transition hover:text-white/80 lg:hidden"
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

function SidebarFooter({
  profile,
  onLinkClick,
}: {
  profile: { full_name: string; avatar_url: string | null } | null;
  onLinkClick?: () => void;
}) {
  const tNav = useTranslations("nav");
  return (
    <div className="border-t border-white/[0.04] p-3">
      <Link href="/dashboard/settings?section=profile" onClick={onLinkClick}>
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
          {/* Avatar */}
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
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DashboardLayoutClient
// ─────────────────────────────────────────────────────────────

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const tNav = useTranslations("nav");

  const [loading, setLoading]         = useState(true);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [userRole, setUserRole]       = useState("member");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  function toggleGroup(id: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const [sidebarProfile, setSidebarProfile] = useState<{
    full_name: string;
    avatar_url: string | null;
  } | null>(null);

  useEffect(() => {
    // Failsafe: if initialize() hangs (auth server unreachable, network stall),
    // release the loading gate after 10 s so the page is never permanently blocked.
    const failsafe = setTimeout(() => setLoading(false), 10_000);

    async function initialize() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { window.location.href = "/login"; return; }

        const { data: profile } = await supabase
          .from("profiles")
          .select("platform_role, status, full_name, avatar_url")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profile) {
          setSidebarProfile({
            full_name:  profile.full_name ?? session.user.email ?? "",
            avatar_url: profile.avatar_url ?? null,
          });
        }

        if (profile?.status === "suspended") {
          await supabase.auth.signOut();
          window.location.href = "/login";
          return;
        }

        const role = profile?.platform_role || "user";
        setUserRole(role);

        const hasAccess = role === "beta" || role === "team" || role === "admin";
        if (!hasAccess) { window.location.href = "/waitlist"; return; }

        clearTimeout(failsafe);
        setLoading(false);
      } catch {
        clearTimeout(failsafe);
        setLoading(false);
      }
    }
    initialize();

    return () => clearTimeout(failsafe);
  }, []);

  if (loading) return <GunimiLoader />;

  const closeMobile = () => setMobileOpen(false);

  const sidebarClasses = [
    "flex flex-col h-full",
    "bg-[#05060A]",
    "border-r border-white/[0.04]",
  ].join(" ");

  return (
    <div className="flex min-h-screen bg-[#05060A] text-white">

      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden w-[248px] shrink-0 lg:flex ${sidebarClasses}`}>
        <SidebarHeader />
        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-2.5 py-3">
          <SidebarNav
            groups={NAV_GROUPS}
            pathname={pathname}
            t={tNav}
            collapsedGroups={collapsedGroups}
            onToggleGroup={toggleGroup}
          />
        </nav>
        <SidebarFooter profile={sidebarProfile} />
      </aside>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className={`fixed left-0 top-0 z-50 h-screen w-[248px] lg:hidden ${sidebarClasses}`}
            >
              <SidebarHeader onClose={closeMobile} />
              <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-2.5 py-3">
                <SidebarNav
                  groups={NAV_GROUPS}
                  pathname={pathname}
                  t={tNav}
                  collapsedGroups={collapsedGroups}
                  onToggleGroup={toggleGroup}
                  onLinkClick={closeMobile}
                />
              </nav>
              <SidebarFooter profile={sidebarProfile} onLinkClick={closeMobile} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN */}
      <div className="flex min-h-screen flex-1 flex-col">
        <OrbitTopbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <OrbitCommand userRole={userRole} />

        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex-1 px-5 py-6 lg:px-8 lg:py-8"
          >
            {/* Subtle deep-space ambient — very faint top-right nebula */}
            <div
              className="pointer-events-none absolute right-0 top-0 h-[400px] w-[600px] opacity-[0.04]"
              style={{ background: "radial-gradient(ellipse at top right, #6D5BFF, transparent 60%)" }}
            />
            <div className="relative z-10">{children}</div>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
