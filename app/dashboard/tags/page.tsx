import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Tag, Sparkles } from "lucide-react";
import { getTagsOverview } from "@/server/actions/tags/getTagsOverview";
import { TAG_COLOR_CLASSES } from "@/types/tag";
import GunimiSection from "@/components/layout/GunimiSection";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import type { TagOverviewItem } from "@/server/actions/tags/getTagsOverview";

export async function generateMetadata() {
  const t = await getTranslations("tags");
  return { title: t("indexTitle") };
}

export default async function TagsIndexPage() {
  const [t, tags] = await Promise.all([
    getTranslations("tags"),
    getTagsOverview(),
  ]);

  const withAI = tags.filter((t) => t.aiSummary).length;

  return (
    <div className="space-y-8 pb-16">
      <GunimiSection>
        <div className="flex items-start justify-between gap-4">
          <GunimiHeading
            badge={`${tags.length} ${t("indexBadge")}`}
            title={t("indexTitle")}
            subtitle={t("indexSubtitle")}
          />
          {withAI > 0 && (
            <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-violet-500/15 bg-violet-500/[0.06] px-3 py-1.5">
              <Sparkles size={11} className="text-violet-400/60" />
              <span className="text-[11px] text-violet-300/60">
                {withAI} {t("indexAiCovered")}
              </span>
            </div>
          )}
        </div>
      </GunimiSection>

      {tags.length === 0 ? (
        <GunimiSection>
          <GunimiEmptyState
            icon={Tag}
            title={t("emptyTitle")}
            description={t("indexEmptyDescription")}
          />
        </GunimiSection>
      ) : (
        <GunimiSection>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tags.map((tag) => (
              <TagCard key={tag.id} tag={tag} t={t} />
            ))}
          </div>
        </GunimiSection>
      )}
    </div>
  );
}

function TagCard({
  tag,
  t,
}: {
  tag: TagOverviewItem;
  t: Awaited<ReturnType<typeof getTranslations<"tags">>>;
}) {
  const colors = TAG_COLOR_CLASSES[tag.color] ?? TAG_COLOR_CLASSES.violet;

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
