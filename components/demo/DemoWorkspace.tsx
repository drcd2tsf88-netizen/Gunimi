"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { SidebarNav, SidebarHeader, SidebarFooter } from "@/components/sidebar/SidebarShell";
import TodayView from "@/components/today/TodayView";
import { NAV_GROUPS } from "@/config/navigation";
import {
  DEMO_DISPLAY_NAME,
  DEMO_WORKSPACE_NAME,
  DEMO_PROFILE,
  DEMO_TODAY_DATA,
} from "@/lib/demo/demoWorkspaceData";

const DEMO_PATHNAME = "/dashboard";
const DEMO_COLLAPSED = new Set<string>();

export default function DemoWorkspace() {
  const t = useTranslations("landing.actIV");
  const tNav = useTranslations("nav");

  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-8%" });

  const [cmdVisible, setCmdVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const c1 = setTimeout(() => setCmdVisible(true), 1800);
    const c2 = setTimeout(() => setCtaVisible(true), 3000);
    return () => {
      clearTimeout(c1);
      clearTimeout(c2);
    };
  }, [isInView]);

  function layer(delay: number) {
    return {
      initial: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
      animate: isInView
        ? {
            opacity: 1,
            y: 0,
            transition: {
              duration: shouldReduceMotion ? 0.2 : 0.9,
              delay: shouldReduceMotion ? 0 : delay,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            },
          }
        : {},
    };
  }

  return (
    <motion.div
      ref={ref}
      className="flex min-h-[520px] overflow-hidden bg-[#05060A] text-white lg:min-h-[700px]"
      initial={{ opacity: 0 }}
      animate={
        isInView
          ? { opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
          : {}
      }
    >
      {/* ── Desktop Sidebar ────────────────────────────────────────── */}
      <motion.aside
        {...layer(0.08)}
        className="hidden w-[248px] shrink-0 flex-col border-r border-white/[0.04] bg-[#05060A] lg:flex"
      >
        <SidebarHeader workspaceName={DEMO_WORKSPACE_NAME} />
        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-2.5 py-3">
          <SidebarNav
            groups={NAV_GROUPS}
            pathname={DEMO_PATHNAME}
            t={tNav as (key: string) => string}
            collapsedGroups={DEMO_COLLAPSED}
            onToggleGroup={() => {}}
          />
        </nav>
        <SidebarFooter profile={DEMO_PROFILE} />
      </motion.aside>

      {/* ── Main Area ──────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col bg-[#070B14]">

        {/* Top bar */}
        <motion.div
          {...layer(0.18)}
          className="flex items-center gap-3 border-b border-white/[0.04] px-5 py-2.5 lg:px-6"
        >
          {/* Mobile workspace identity */}
          <div className="flex items-center gap-2 lg:hidden">
            <span
              className="flex h-5 w-5 items-center justify-center rounded-md"
              style={{ background: "rgba(109,91,255,0.18)" }}
            >
              <span className="h-2 w-2 rounded-[3px] bg-[#6D5BFF]" />
            </span>
            <span className="text-[12px] font-semibold text-[#F7F8FC]">
              {DEMO_WORKSPACE_NAME}
            </span>
          </div>

          {/* Command palette hint — appears after 1.8s */}
          <div className="flex flex-1 items-center justify-end">
            <AnimatePresence>
              {cmdVisible && (
                <motion.div
                  key="cmd-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.055] bg-white/[0.025] px-3 py-1.5"
                >
                  <span className="text-[12px] text-[#9AA3B2]/40">
                    {t("commandHint")}
                  </span>
                  <kbd className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[9px] text-[#9AA3B2]/30">
                    ⌘K
                  </kbd>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 px-5 py-6 lg:px-8">

          <motion.div {...layer(0.42)}>
            <TodayView
              displayName={DEMO_DISPLAY_NAME}
              {...DEMO_TODAY_DATA}
            />
          </motion.div>

          {/* Open Alpha CTA — appears after 3.0s */}
          <AnimatePresence>
            {ctaVisible && (
              <motion.div
                key="alpha-cta"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 rounded-[16px] border border-[#6D5BFF]/20 bg-[#6D5BFF]/[0.06] p-5"
              >
                <p className="text-[14px] font-medium text-[#F7F8FC]/80">
                  {t("cta.prompt")}
                </p>
                <Link
                  href="/register"
                  className="mt-3 inline-flex items-center gap-2 rounded-[10px] bg-[#6D5BFF] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {t("cta.button")}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
