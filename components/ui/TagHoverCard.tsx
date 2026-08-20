"use client";

import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { TAG_COLOR_CLASSES } from "@/types/tag";
import type { WorkspaceTag } from "@/types/tag";
import { getTagSummary, type TagSummary } from "@/server/actions/tags/getTagSummary";
import { useIsHydrated } from "@/lib/hooks/useIsHydrated";

type Props = {
  tag: WorkspaceTag;
  children: React.ReactNode;
};

export default function TagHoverCard({ tag, children }: Props) {
  const t = useTranslations("tags");
  const mounted = useIsHydrated();
  const [visible, setVisible] = useState(false);
  const [summary, setSummary] = useState<TagSummary | null | "loading">(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const fetchedRef = useRef(false);

  const handleEnter = useCallback(() => {
    timerRef.current = setTimeout(async () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      setPos({ top: rect.top - 8, left: rect.left + rect.width / 2 });
      setVisible(true);
      if (!fetchedRef.current) {
        fetchedRef.current = true;
        setSummary("loading");
        const data = await getTagSummary(tag.id);
        setSummary(data);
      }
    }, 350);
  }, [tag.id]);

  const handleLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  const colors = TAG_COLOR_CLASSES[tag.color] ?? TAG_COLOR_CLASSES.violet;
  const isLoading = summary === "loading";
  const counts = isLoading || summary === null ? null : summary;
  const total = counts ? counts.contacts + counts.companies + counts.deals + counts.tasks + counts.notes : null;

  const popup = visible ? (
    <div
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        transform: "translate(-50%, -100%)",
        zIndex: 300,
        marginBottom: 8,
      }}
      className="w-48 rounded-2xl border border-white/[0.08] bg-[#0A0F1F]/95 p-4 shadow-2xl backdrop-blur-2xl"
    >
      {/* Tag name */}
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-2 w-2 shrink-0 rounded-full ${colors.bg} border ${colors.border}`} />
        <span className="text-sm font-semibold text-white">{tag.name}</span>
      </div>

      {/* Counts */}
      {isLoading ? (
        <div className="h-4 w-16 animate-pulse rounded bg-white/[0.06]" />
      ) : total === 0 ? (
        <p className="text-xs text-white/30">{t("noTaggedEntities")}</p>
      ) : (
        <div className="space-y-1.5">
          {counts!.contacts > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/40">{t("taggedContacts")}</span>
              <span className="text-[11px] font-medium text-white/70">{counts!.contacts}</span>
            </div>
          )}
          {counts!.companies > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/40">{t("taggedCompanies")}</span>
              <span className="text-[11px] font-medium text-white/70">{counts!.companies}</span>
            </div>
          )}
          {counts!.deals > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/40">{t("taggedDeals")}</span>
              <span className="text-[11px] font-medium text-white/70">{counts!.deals}</span>
            </div>
          )}
          {counts!.tasks > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/40">{t("taggedTasks")}</span>
              <span className="text-[11px] font-medium text-white/70">{counts!.tasks}</span>
            </div>
          )}
          {counts!.notes > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/40">{t("taggedNotes")}</span>
              <span className="text-[11px] font-medium text-white/70">{counts!.notes}</span>
            </div>
          )}
        </div>
      )}

      {/* View tag link */}
      <Link
        href={`/dashboard/tags/${tag.id}`}
        className="mt-3 block text-right text-[10px] text-white/25 transition-colors hover:text-violet-400"
        onClick={() => setVisible(false)}
      >
        {t("hoverViewTag")} →
      </Link>

      {/* Arrow caret */}
      <span
        style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)" }}
        className="block h-2.5 w-2.5 border-b border-r border-white/[0.08] bg-[#0A0F1F]"
      />
    </div>
  ) : null;

  return (
    <span
      ref={wrapRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="inline-flex"
    >
      {children}
      {mounted && createPortal(popup, document.body)}
    </span>
  );
}
