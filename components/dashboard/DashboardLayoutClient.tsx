"use client";

import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronRight, Sparkles, X } from "lucide-react";

import { NAV_GROUPS, isNavItemActive, type NavGroup } from "@/config/navigation";

import OrbitCommand from "@/components/command/OrbitCommand";
import OrbitTopbar from "@/components/layout/OrbitTopbar";
import OrbitLoader from "@/components/system/OrbitLoader";

import { supabase } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Sidebar nav body — shared between desktop and mobile
// ---------------------------------------------------------------------------

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
                ? "mt-3 border-t border-white/5 pt-3"
                : groupIndex > 0
                ? "mt-1"
                : ""
            }
          >
            {group.labelKey && (
              group.collapsible ? (
                <button
                  type="button"
                  onClick={() => onToggleGroup(group.id)}
                  className="flex w-full items-center justify-between px-3 pb-1 pt-4"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                    {t(group.labelKey)}
                  </p>
                  {isCollapsed ? (
                    <ChevronRight size={11} className="text-zinc-700" />
                  ) : (
                    <ChevronDown size={11} className="text-zinc-700" />
                  )}
                </button>
              ) : (
                <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
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
                    className={`
                      group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all
                      ${
                        active
                          ? "border border-violet-500/20 bg-violet-500/10 text-white"
                          : "border border-transparent text-zinc-400 hover:border-white/[0.06] hover:bg-white/[0.03] hover:text-white"
                      }
                    `}
                  >
                    <div
                      className={`
                        flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors
                        ${
                          active
                            ? "bg-violet-500/10 text-violet-300"
                            : "bg-white/[0.03] text-zinc-500 group-hover:text-zinc-300"
                        }
                      `}
                    >
                      <Icon size={15} />
                    </div>

                    <span className="text-sm font-medium">
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

// ---------------------------------------------------------------------------
// Sidebar header — shared between desktop and mobile
// ---------------------------------------------------------------------------

function SidebarHeader({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5">
      <div className="flex items-center gap-3">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_24px_rgba(124,58,237,0.3)]">
          <Sparkles size={15} className="text-white" />
        </div>

        <div>
          <h1 className="text-sm font-semibold text-white">Gunimi</h1>
          <p className="mt-0.5 text-[10px] text-zinc-500">AI Workspace OS</p>
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close navigation"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:text-white lg:hidden"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar footer (profile link)
// ---------------------------------------------------------------------------

function SidebarFooter({
  profile,
  onLinkClick,
}: {
  profile: { full_name: string; avatar_url: string | null } | null;
  onLinkClick?: () => void;
}) {
  const tNav = useTranslations("nav");
  return (
    <div className="border-t border-white/5 p-4">
      <Link
        href="/dashboard/settings?section=profile"
        onClick={onLinkClick}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 transition-all hover:border-violet-500/20 hover:bg-violet-500/5">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-violet-500/15 text-sm font-semibold text-violet-300">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt=""
                fill
                className="object-cover"
              />
            ) : (
              (profile?.full_name?.[0] ?? "O").toUpperCase()
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white/80">
              {profile?.full_name ?? "Profile"}
            </p>
            <p className="text-[10px] text-white/30">{tNav("profileSettings")}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const tNav = useTranslations("nav");

  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState("member");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  function toggleGroup(id: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }
  const [sidebarProfile, setSidebarProfile] = useState<{
    full_name: string;
    avatar_url: string | null;
  } | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          window.location.href = "/login";
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("platform_role, status, full_name, avatar_url")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profile) {
          setSidebarProfile({
            full_name: profile.full_name ?? session.user.email ?? "",
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

        const hasAccess =
          role === "beta" || role === "team" || role === "admin";

        if (!hasAccess) {
          window.location.href = "/waitlist";
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    initialize();
  }, []);

  if (loading) {
    return <OrbitLoader />;
  }

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="flex min-h-screen bg-[#050816] text-white">

      {/* DESKTOP SIDEBAR */}

      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-white/5 bg-white/[0.02] backdrop-blur-2xl lg:flex">
        <SidebarHeader />

        <nav
          aria-label="Main navigation"
          className="flex-1 overflow-y-auto px-3 py-4"
        >
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
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 24, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-white/10 bg-[#050816] backdrop-blur-2xl lg:hidden"
            >
              <SidebarHeader onClose={closeMobile} />

              <nav
                aria-label="Main navigation"
                className="flex-1 overflow-y-auto px-3 py-4"
              >
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
