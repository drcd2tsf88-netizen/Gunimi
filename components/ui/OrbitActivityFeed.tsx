"use client";

import Link from "next/link";

import { motion }
from "framer-motion";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitCard
from "@/components/ui/OrbitCard";

import OrbitSkeleton
from "@/components/ui/OrbitSkeleton";

import getRelativeTime
from "@/lib/utils/getRelativeTime";

import { LucideIcon }
from "lucide-react";

export type OrbitActivityItem = {
  id: string;
  type?: string;
  title?: string;
  message?: string;
  description?: string;
  created_at: string;
  company_id?: string | null;
  deal_id?: string | null;
};

type Props = {
  items: OrbitActivityItem[];
  loading?: boolean;
  badge?: string;
  feedTitle?: string;
  subtitle?: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon?: LucideIcon;
  showType?: boolean;
  compact?: boolean;
  animated?: boolean;
  dateDisplay?: "relative" | "localeString" | "localeDate";
  itemFallback?: string;
  getItemHref?: (item: OrbitActivityItem) => string | undefined;
};

function formatActivityText(
  text?: string
): string | undefined {
  if (!text) return undefined;
  return text
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function OrbitActivityFeed({
  items,
  loading = false,
  badge,
  feedTitle,
  subtitle,
  emptyTitle,
  emptyDescription,
  showType = true,
  compact = false,
  animated = true,
  dateDisplay = "localeString",
  itemFallback,
  getItemHref,
}: Props) {
  function displayDate(
    dateStr: string
  ): string {
    if (dateDisplay === "relative")
      return getRelativeTime(dateStr);
    if (dateDisplay === "localeDate")
      return new Date(dateStr).toLocaleDateString();
    return new Date(dateStr).toLocaleString();
  }

  return (
    <OrbitSection>
      {feedTitle && (
        <OrbitHeading
          badge={badge}
          title={feedTitle}
          subtitle={subtitle}
        />
      )}

      <div
        className={
          compact ? "space-y-3" : "space-y-5"
        }
      >
        {loading &&
          [1, 2, 3].map((i) => (
            <OrbitSkeleton key={i} />
          ))}

        {!loading && items.length === 0 && (
          <OrbitCard className="p-10 text-center">
            <h2 className="text-xl font-semibold">
              {emptyTitle}
            </h2>

            <p className="mt-3 text-sm text-white/50">
              {emptyDescription}
            </p>
          </OrbitCard>
        )}

        {!loading &&
          items.map((item, index) => {
            const displayTitle =
              formatActivityText(
                item.title || item.message
              ) ?? itemFallback;

            const displayType = formatActivityText(
              item.type
            );

            const displayDescription =
              formatActivityText(item.description);

            const href = getItemHref?.(item);

            const card = (
              <OrbitCard
                className={compact ? "p-4" : "p-6"}
              >
                <div
                  className={
                    compact
                      ? "flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
                      : "flex items-start justify-between gap-6"
                  }
                >
                  <div>
                    {showType && displayType && (
                      <div
                        className="
                          inline-flex
                          rounded-full
                          border border-violet-500/20
                          bg-violet-500/10
                          px-3 py-1
                          text-xs uppercase tracking-wide
                          text-violet-300
                        "
                      >
                        {displayType}
                      </div>
                    )}

                    {displayTitle && (
                      <h2
                        className={
                          compact
                            ? "mt-3 text-base font-semibold line-clamp-2"
                            : "mt-4 text-lg font-semibold text-white"
                        }
                      >
                        {displayTitle}
                      </h2>
                    )}

                    {displayDescription && (
                      <p
                        className="
                          mt-3
                          text-sm leading-relaxed
                          text-white/60
                        "
                      >
                        {displayDescription}
                      </p>
                    )}
                  </div>

                  <div
                    className="
                      whitespace-nowrap
                      text-sm text-white/40
                    "
                  >
                    {displayDate(item.created_at)}
                  </div>
                </div>
              </OrbitCard>
            );

            const wrappedCard = href ? (
              <Link
                href={href}
                className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
              >
                {card}
              </Link>
            ) : card;

            return animated ? (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {wrappedCard}
              </motion.div>
            ) : (
              <div key={item.id}>{wrappedCard}</div>
            );
          })}
      </div>
    </OrbitSection>
  );
}
