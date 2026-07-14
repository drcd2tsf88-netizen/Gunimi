"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { NAV_GROUPS } from "@/config/navigation";

import OrbitCommand from "@/components/command/OrbitCommand";
import OrbitTopbar from "@/components/layout/OrbitTopbar";
import GunimiLoader from "@/components/system/GunimiLoader";
import FeedbackSheet from "@/components/dogfood/FeedbackSheet";

import { supabase } from "@/lib/supabase";
import { SidebarNav, SidebarHeader, SidebarFooter } from "@/components/sidebar/SidebarShell";
import { useDogfoodStore } from "@/lib/store/dogfood-store";

// ─────────────────────────────────────────────────────────────
// DashboardLayoutClient
// ─────────────────────────────────────────────────────────────

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const tNav = useTranslations("nav");

  const [loading, setLoading]         = useState(true);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [userRole, setUserRole]       = useState("member");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const { openFeedback, dogfoodEnabled, setContext } = useDogfoodStore();

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

  const [workspaceName, setWorkspaceName] = useState<string | null>(null);

  useEffect(() => {
    // Failsafe: if initialize() hangs (auth server unreachable, network stall),
    // release the loading gate after 10 s so the page is never permanently blocked.
    const failsafe = setTimeout(() => setLoading(false), 10_000);

    async function initialize() {
      try {
        // getUser() validates the JWT with the Supabase Auth server and refreshes
        // expired tokens. Using getSession() here is unsafe: it returns the stale
        // in-memory session without validating expiry, so subsequent database
        // queries can fail with 401 when the access token has rotated or expired,
        // causing membership checks to return null and triggering a redirect loop
        // between /dashboard and /register/setup.
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { window.location.href = "/login"; return; }

        const { data: profile } = await supabase
          .from("profiles")
          .select("platform_role, status, full_name, avatar_url")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          setSidebarProfile({
            full_name:  profile.full_name ?? user.email ?? "",
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

        // Approved user with no workspace — send to workspace setup.
        // This handles the first login after admin approval.
        const { data: membership } = await supabase
          .from("workspace_members")
          .select("workspace_id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (!membership) { window.location.href = "/register/setup"; return; }

        const { data: ws } = await supabase
          .from("workspaces")
          .select("name, preferences")
          .eq("id", membership.workspace_id)
          .maybeSingle();
        if (ws) {
          setWorkspaceName(ws.name);
          const prefs = ws.preferences as Record<string, unknown> | null;
          setContext({
            dogfoodEnabled: !!prefs?.dogfoodEnabled,
            workspaceId: membership.workspace_id,
            userId: user.id,
          });
        }

        clearTimeout(failsafe);
        setLoading(false);
      } catch {
        clearTimeout(failsafe);
        setLoading(false);
      }
    }
    initialize();

    // Session guard: redirect to login if session ends (token expired, manual sign-out
    // from another tab, or admin-revoked access).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.push("/login?reason=session_expired");
      }
    });

    return () => {
      clearTimeout(failsafe);
      subscription.unsubscribe();
    };
  }, [router, setContext]);

  // Keyboard shortcut: ? opens the feedback sheet when dogfood mode is active
  useEffect(() => {
    if (!dogfoodEnabled) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        openFeedback();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dogfoodEnabled, openFeedback]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    // onAuthStateChange will fire SIGNED_OUT and router.push("/login")
  }

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
        <SidebarHeader workspaceName={workspaceName} />
        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-2.5 py-3">
          <SidebarNav
            groups={NAV_GROUPS}
            pathname={pathname}
            t={tNav}
            collapsedGroups={collapsedGroups}
            onToggleGroup={toggleGroup}
          />
        </nav>
        <SidebarFooter profile={sidebarProfile} onSignOut={handleSignOut} />
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
              className="fixed inset-0 z-[30] bg-black/70 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -248 }}
              animate={{ x: 0 }}
              exit={{ x: -248 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className={`fixed left-0 top-0 z-50 h-screen w-[248px] lg:hidden ${sidebarClasses}`}
            >
              <SidebarHeader onClose={closeMobile} workspaceName={workspaceName} />
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
              <SidebarFooter profile={sidebarProfile} onLinkClick={closeMobile} onSignOut={handleSignOut} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN */}
      <div className="flex min-h-screen flex-1 flex-col">
        <OrbitTopbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <OrbitCommand userRole={userRole} />
        {dogfoodEnabled && <FeedbackSheet />}

        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex-1 px-5 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8"
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
