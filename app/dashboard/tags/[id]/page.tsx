import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  User,
  Building2,
  TrendingUp,
  CheckSquare,
  FileText,
  ArrowLeft,
  Tag,
} from "lucide-react";
import { getTagWithEntities } from "@/server/actions/tags/getTagWithEntities";
import { TAG_COLOR_CLASSES } from "@/types/tag";
import GunimiSection from "@/components/layout/GunimiSection";
import GunimiCard from "@/components/ui/GunimiCard";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import type { TagContact, TagCompany, TagDeal, TagTask, TagNote } from "@/server/actions/tags/getTagWithEntities";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const result = await getTagWithEntities(id);
  const t = await getTranslations("tags");
  return { title: result ? `${t("tagDetailPageTitle")}: ${result.tag.name}` : t("tagDetailPageTitle") };
}

const PRIORITY_COLOR: Record<string, string> = {
  high: "text-red-400",
  medium: "text-amber-400",
  low: "text-zinc-500",
};

const STATUS_DOT: Record<string, string> = {
  todo: "bg-zinc-500",
  in_progress: "bg-amber-400",
  done: "bg-emerald-400",
};

export default async function TagDetailPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations("tags");

  const result = await getTagWithEntities(id);
  if (!result) notFound();

  const { tag, contacts, companies, deals, tasks, notes } = result;
  const colors = TAG_COLOR_CLASSES[tag.color] ?? TAG_COLOR_CLASSES.violet;
  const total = contacts.length + companies.length + deals.length + tasks.length + notes.length;

  return (
    <div className="space-y-8 pb-16">
      {/* Back */}
      <GunimiSection>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
        >
          <ArrowLeft size={12} />
          {t("backToSettings")}
        </Link>
      </GunimiSection>

      {/* Header */}
      <GunimiSection>
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${colors.border} ${colors.bg}`}>
            <Tag size={20} className={colors.text} />
          </div>
          <div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${colors.bg} ${colors.text} ${colors.border}`}>
              {tag.name}
            </span>
            <p className="mt-1.5 text-sm text-white/40">{t("tagDetailSubtitle")}</p>
          </div>
        </div>
      </GunimiSection>

      {total === 0 ? (
        <GunimiSection>
          <GunimiEmptyState
            icon={Tag}
            title={t("noTaggedEntities")}
            description={t("noTaggedEntitiesDescription")}
          />
        </GunimiSection>
      ) : (
        <div className="space-y-6">
          {/* CONTACTS */}
          {contacts.length > 0 && (
            <GunimiSection>
              <EntitySection
                icon={<User size={14} className="text-cyan-400" />}
                title={t("taggedContacts")}
                count={contacts.length}
              >
                {contacts.map((c: TagContact) => (
                  <EntityRow
                    key={c.id}
                    href={`/dashboard/contacts/${c.id}`}
                    primary={[c.first_name, c.last_name].filter(Boolean).join(" ")}
                    secondary={c.email ?? undefined}
                    dot="bg-cyan-500"
                  />
                ))}
              </EntitySection>
            </GunimiSection>
          )}

          {/* COMPANIES */}
          {companies.length > 0 && (
            <GunimiSection>
              <EntitySection
                icon={<Building2 size={14} className="text-blue-400" />}
                title={t("taggedCompanies")}
                count={companies.length}
              >
                {companies.map((c: TagCompany) => (
                  <EntityRow
                    key={c.id}
                    href={`/dashboard/companies/${c.id}`}
                    primary={c.name}
                    secondary={c.industry ?? undefined}
                    dot="bg-blue-500"
                  />
                ))}
              </EntitySection>
            </GunimiSection>
          )}

          {/* DEALS */}
          {deals.length > 0 && (
            <GunimiSection>
              <EntitySection
                icon={<TrendingUp size={14} className="text-emerald-400" />}
                title={t("taggedDeals")}
                count={deals.length}
              >
                {deals.map((d: TagDeal) => (
                  <EntityRow
                    key={d.id}
                    href={`/dashboard/deals/${d.id}`}
                    primary={d.name}
                    secondary={d.stage ?? undefined}
                    meta={d.value != null ? `$${d.value.toLocaleString()}` : undefined}
                    dot="bg-emerald-500"
                  />
                ))}
              </EntitySection>
            </GunimiSection>
          )}

          {/* TASKS */}
          {tasks.length > 0 && (
            <GunimiSection>
              <EntitySection
                icon={<CheckSquare size={14} className="text-violet-400" />}
                title={t("taggedTasks")}
                count={tasks.length}
              >
                {tasks.map((task: TagTask) => (
                  <EntityRow
                    key={task.id}
                    href="/dashboard/tasks"
                    primary={task.title}
                    secondary={task.status.replace("_", " ")}
                    dot={STATUS_DOT[task.status] ?? "bg-zinc-500"}
                    metaClass={PRIORITY_COLOR[task.priority]}
                    meta={task.priority}
                  />
                ))}
              </EntitySection>
            </GunimiSection>
          )}

          {/* NOTES */}
          {notes.length > 0 && (
            <GunimiSection>
              <EntitySection
                icon={<FileText size={14} className="text-amber-400" />}
                title={t("taggedNotes")}
                count={notes.length}
              >
                {notes.map((n: TagNote) => (
                  <EntityRow
                    key={n.id}
                    href="/dashboard/notes"
                    primary={n.title}
                    secondary={new Date(n.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    dot="bg-amber-500"
                  />
                ))}
              </EntitySection>
            </GunimiSection>
          )}
        </div>
      )}
    </div>
  );
}

function EntitySection({
  icon,
  title,
  count,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <GunimiCard className="overflow-hidden p-0">
      <div className="flex items-center gap-2 border-b border-white/[0.05] px-5 py-3.5">
        {icon}
        <span className="text-sm font-medium text-white/70">{title}</span>
        <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/30">
          {count}
        </span>
      </div>
      <div className="divide-y divide-white/[0.04]">{children}</div>
    </GunimiCard>
  );
}

function EntityRow({
  href,
  primary,
  secondary,
  meta,
  metaClass,
  dot,
}: {
  href: string;
  primary: string;
  secondary?: string;
  meta?: string;
  metaClass?: string;
  dot?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.03]"
    >
      {dot && <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />}
      <span className="flex-1 min-w-0">
        <span className="block truncate text-sm text-white/80">{primary}</span>
        {secondary && (
          <span className="block truncate text-[11px] capitalize text-white/35">{secondary}</span>
        )}
      </span>
      {meta && (
        <span className={`shrink-0 text-[11px] capitalize ${metaClass ?? "text-white/35"}`}>
          {meta}
        </span>
      )}
    </Link>
  );
}
