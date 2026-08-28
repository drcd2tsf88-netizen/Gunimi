import { getTranslations } from "next-intl/server";
import { Tag, Sparkles } from "lucide-react";
import { getTagsOverview } from "@/server/actions/tags/getTagsOverview";
import GunimiSection from "@/components/layout/GunimiSection";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import TagsGrid from "@/components/tags/TagsGrid";

export async function generateMetadata() {
  const t = await getTranslations("tags");
  return { title: t("indexTitle") };
}

export default async function TagsIndexPage() {
  const [t, tags] = await Promise.all([
    getTranslations("tags"),
    getTagsOverview(),
  ]);

  const withAI = tags.filter((tag) => tag.aiSummary).length;

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
          <TagsGrid tags={tags} />
        </GunimiSection>
      )}
    </div>
  );
}
