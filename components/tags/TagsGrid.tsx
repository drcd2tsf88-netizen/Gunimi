"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { TAG_COLOR_CLASSES, TAG_COLORS } from "@/types/tag";
import type { TagColor } from "@/types/tag";
import type { TagOverviewItem } from "@/server/actions/tags/getTagsOverview";

type SortKey = "count" | "alpha";

type Props = {
  tags: TagOverviewItem[];
};

export default function TagsGrid({ tags }: Props) {
  const t = useTranslations("tags");
  const [search, setSearch] = useState("");
  const [colorFilter, setColorFilter] = useState<TagColor | null>(null);
  const [sort, setSort] = useState<SortKey>("count");

  const colorsInUse = useMemo(
    () => TAG_COLORS.filter((c) => tags.some((tag) => tag.color === c)),
    [tags]
  );

  const filtered = useMemo(() => {
    let result = tags;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }

    if (colorFilter) {
      result = result.filter((t) => t.color === colorFilter);
    }

    if (sort === "count") {
      result = [...result].sort((a, b) => b.entityCount - a.entityCount);
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [tags, search, colorFilter, sort]);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("filterSearch")}
            className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] py-2 pl-8 pr-4 text-sm text-white/70 outline-none placeholder:text-white/20 focus:border-violet-500/30 focus:bg-violet-500/[0.03] transition-all"
          />
        </div>

        {/* Sort toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.07] bg-white/[0.02] p-1">
          <button
            onClick={() => setSort("count")}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all ${
              sort === "count"
                ? "bg-white/[0.07] text-white/70"
                : "text-white/25 hover:text-white/40"
            }`}
          >
            {t("sortByCount")}
          </button>
          <button
            onClick={() => setSort("alpha")}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all ${
              sort === "alpha"
                ? "bg-white/[0.07] text-white/70"
                : "text-white/25 hover:text-white/40"
            }`}
          >
            {t("sortAlpha")}
          </button>
        </div>
      </div>

      {/* Color filter chips */}
      {colorsInUse.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setColorFilter(null)}
            className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-all ${
              colorFilter === null
                ? "border-white/20 bg-white/[0.07] text-white/60"
                : "border-white/[0.06] bg-transparent text-white/25 hover:border-white/10 hover:text-white/40"
            }`}
          >
            {t("filterAll")}
          </button>
          {colorsInUse.map((color) => {
            const cls = TAG_COLOR_CLASSES[color] ?? TAG_COLOR_CLASSES.violet!;
            const active = colorFilter === color;
            return (
              <button
                key={color}
                onClick={() => setColorFilter(active ? null : color)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-all ${
                  active
                    ? `${cls.bg} ${cls.border} ${cls.text}`
                    : "border-white/[0.06] bg-transparent text-white/30 hover:border-white/10 hover:text-white/45"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${cls.bg} border ${cls.border}`} />
                {color}
              </button>
            );
          })}
        </div>
      )}

      {/* Results count */}
      {(search || colorFilter) && (
        <p className="text-[11px] text-white/25">
          {filtered.length} {t("filterResults")}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/20">{t("filterEmpty")}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tag) => (
            <TagCard key={tag.id} tag={tag} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function TagCard({
  tag,
  t,
}: {
  tag: TagOverviewItem;
  t: ReturnType<typeof useTranslations<"tags">>;
}) {
  const colors = TAG_COLOR_CLASSES[tag.color] ?? TAG_COLOR_CLASSES.violet!;

  return (
    <Link
      href={`/dashboard/tags/${tag.id}`}
      className="group flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4 transition-all hover:border-white/[0.1] hover:bg-white/[0.03]"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${colors.bg} border ${colors.border}`} />
          {tag.name}
        </span>
        <span className="ml-auto rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-white/30">
          {tag.entityCount} {t("indexEntities")}
        </span>
      </div>

      {/* AI Summary */}
      {tag.aiSummary ? (
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-1">
            <Sparkles size={9} className="text-violet-400/50" />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-violet-400/50">
              {t("aiInsightTitle")}
            </span>
          </div>
          <p className="line-clamp-3 text-[11px] leading-relaxed text-white/35">
            {tag.aiSummary}
          </p>
        </div>
      ) : (
        <p className="text-[11px] text-white/20">
          {tag.entityCount === 0 ? t("noTaggedEntities") : t("indexNoAiYet")}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-end">
        <span className="text-[10px] text-white/20 transition-colors group-hover:text-violet-400/60">
          {t("hoverViewTag")} →
        </span>
      </div>
    </Link>
  );
}
