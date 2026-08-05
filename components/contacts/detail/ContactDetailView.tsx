"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Building2,
  CalendarDays,
  CheckSquare,
  FileText,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ContactHeader from "@/components/contacts/detail/ContactHeader";
import ContactIntelligence from "@/components/contacts/detail/ContactIntelligence";
import ContactTasks from "@/components/contacts/detail/ContactTasks";
import ContactNotes from "@/components/contacts/detail/ContactNotes";
import ContactEmails from "@/components/contacts/detail/ContactEmails";

import GunimiWorkspaceTabs from "@/components/ui/GunimiWorkspaceTabs";
import type { WorkspaceTab } from "@/components/ui/GunimiWorkspaceTabs";
import GunimiDecisionCard from "@/components/ui/GunimiDecisionCard";
import GunimiPreparationCard from "@/components/ui/GunimiPreparationCard";
import type { PreparationItem } from "@/components/ui/GunimiPreparationCard";
import GunimiContextCard from "@/components/ui/GunimiContextCard";
import type { ContextEntry } from "@/components/ui/GunimiContextCard";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import GunimiCard from "@/components/ui/GunimiCard";

import { resolveContactDecision } from "@/lib/contacts/decision";
import { resolveContactPreparation } from "@/lib/contacts/preparation";
import type { ContactPrepItem } from "@/lib/contacts/preparation";
import { resolveContactContext } from "@/lib/contacts/context";

import type { Contact } from "@/types/contact";
import type { Deal } from "@/types/deal";
import type { ContactTask } from "@/server/actions/crm/getContactTasks";
import type { ContactNote } from "@/server/actions/crm/getContactNotes";
import type { WorkspaceActivity } from "@/types/activity";
import type { EmailThread } from "@/types/email";
import type { WorkspaceTag } from "@/types/tag";
import type { WorkspaceAttachment } from "@/server/actions/attachments/getAttachments";
import AttachmentsPanel from "@/components/attachments/AttachmentsPanel";
import ResponsibilitiesPanel from "@/components/organization/ResponsibilitiesPanel";
import type { WorkspaceTeam } from "@/types/organization";
import ContactTimeline from "@/components/timeline/ContactTimeline";
import OpenTasksStrip from "@/components/tasks/OpenTasksStrip";

const CONTACT_PREP_ICONS: Record<ContactPrepItem["iconKey"], LucideIcon> = {
  company: Building2,
  activity: Clock,
  task: CheckSquare,
  note: FileText,
  deal: TrendingUp,
};

const CONTEXT_ICONS: Record<
  "relationships" | "notes" | "tasks" | "meeting" | "deals",
  LucideIcon
> = {
  relationships: Users,
  notes: FileText,
  tasks: CheckSquare,
  meeting: CalendarDays,
  deals: TrendingUp,
};

type Props = {
  contact: Contact;
  deals: Deal[];
  tasks: ContactTask[];
  activities: WorkspaceActivity[];
  notes: ContactNote[];
  emails: EmailThread[];
  allTags: WorkspaceTag[];
  entityTags: WorkspaceTag[];
  attachments: WorkspaceAttachment[];
  teams: WorkspaceTeam[];
};

export default function ContactDetailView({
  contact,
  deals,
  tasks,
  activities,
  notes,
  emails,
  allTags,
  entityTags,
  attachments,
  teams,
}: Props) {
  const t = useTranslations("contacts");

  const decision = useMemo(
    () => resolveContactDecision(contact, tasks, deals),
    [contact, tasks, deals],
  );

  const rawPrep = useMemo(
    () => resolveContactPreparation(contact, decision, tasks, notes, deals),
    [contact, decision, tasks, notes, deals],
  );

  const rawContext = useMemo(
    () => resolveContactContext(contact, deals, notes, tasks, activities),
    [contact, deals, notes, tasks, activities],
  );

  const prepItems: PreparationItem[] = useMemo(
    () =>
      rawPrep.map((item) => ({
        icon: CONTACT_PREP_ICONS[item.iconKey],
        label: t(item.labelKey),
        value: item.value,
        href: item.href,
        secondary:
          item.secondaryRaw ??
          (item.secondaryKey
            ? t(item.secondaryKey, item.secondaryParams)
            : undefined),
      })),
    [rawPrep, t],
  );

  const contextSections = useMemo(
    () =>
      rawContext.map((section) => ({
        id: section.id,
        title: t(section.titleKey),
        icon: CONTEXT_ICONS[section.iconKey],
        entries: section.entries.map(
          (entry): ContextEntry => ({
            id: entry.id,
            label: entry.labelKey ? t(entry.labelKey) : undefined,
            primary: entry.primary,
            secondary: entry.secondary,
            href: entry.href,
            meta: entry.metaRaw,
          }),
        ),
      })),
    [rawContext, t],
  );

  const pendingTaskCount = tasks.filter((task) => task.status !== "done").length;
  const [localTasks, setLocalTasks] = useState(tasks);

  const hasSummary = !!(
    contact.position ||
    contact.email ||
    contact.phone
  );

  const tabs: WorkspaceTab[] = [
    {
      id: "overview",
      label: t("tabOverview"),
      content: (
        <div className="space-y-4">
          <ContactIntelligence
            contact={contact}
            deals={deals}
            activeDecisionAction={decision?.action}
          />
          <GunimiDecisionCard
            label={t("decisionSuggestedLabel")}
            action={
              decision
                ? t(decision.actionKey, decision.reasonParams)
                : t("decisionEmptyLabel")
            }
            reason={
              decision
                ? t(decision.reasonKey, decision.reasonParams)
                : t("decisionEmptyReason")
            }
            isEmpty={!decision}
            href={(() => {
              switch (decision?.action) {
                case "overdue_tasks":
                case "follow_up":
                  return "/dashboard/tasks";
                case "deal_attention":
                  return "/dashboard/deals";
                case "link_company":
                  return "/dashboard/companies";
                default:
                  return undefined;
              }
            })()}
          />
          {prepItems.length > 0 && (
            <GunimiPreparationCard
              label={t("preparationLabel")}
              items={prepItems}
            />
          )}
          <OpenTasksStrip
            tasks={localTasks}
            contactId={contact.id}
            onTaskCreated={(task) =>
              setLocalTasks((prev) => [
                { ...task, description: null, created_at: new Date().toISOString() },
                ...prev,
              ])
            }
          />
          {notes.length > 0 && (
            <GunimiCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={12} className="text-white/30" aria-hidden />
                <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-medium">
                  {t("recentNotes")}
                </span>
              </div>
              <div className="space-y-1.5">
                {notes.slice(0, 3).map((note) => (
                  <Link
                    key={note.id}
                    href={`/dashboard/notes/${note.id}`}
                    className="block rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-violet-500/20 hover:bg-violet-500/[0.04]"
                  >
                    <p className="truncate text-xs font-medium text-white/80">{note.title}</p>
                    {note.content && (
                      <p className="mt-0.5 truncate text-[10px] text-white/40">
                        {note.content.replace(/<[^>]+>/g, "").slice(0, 80)}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </GunimiCard>
          )}
          {hasSummary && (
            <GunimiCard className="divide-y divide-white/[0.04] p-5">
              {contact.position && (
                <div className="pb-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    {t("position")}
                  </p>
                  <p className="mt-1.5 text-sm text-white/80">
                    {contact.position}
                  </p>
                </div>
              )}
              {contact.email && (
                <div className="py-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    {t("email")}
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="mt-1.5 block text-sm text-violet-300 transition-colors hover:text-violet-200"
                  >
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.phone && (
                <div className="py-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    {t("phone")}
                  </p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="mt-1.5 block text-sm text-violet-300 transition-colors hover:text-violet-200"
                  >
                    {contact.phone}
                  </a>
                </div>
              )}
            </GunimiCard>
          )}
        </div>
      ),
    },
    {
      id: "history",
      label: t("tabHistory"),
      content: (
        <ContactTimeline
          activities={activities}
          notes={notes}
          tasks={tasks}
          emails={emails}
          deals={deals}
          attachments={attachments}
        />
      ),
    },
    {
      id: "work",
      label: t("tabWork"),
      badge: pendingTaskCount > 0 ? pendingTaskCount : undefined,
      content: (
        <div className="space-y-8">
          <ResponsibilitiesPanel entityType="contact" entityId={contact.id} teams={teams} />
          <ContactTasks tasks={tasks} />
          <ContactNotes contact={contact} notes={notes} />
          <ContactEmails threads={emails} />
          <AttachmentsPanel
            entityType="contact"
            entityId={contact.id}
            initialAttachments={attachments}
          />
        </div>
      ),
    },
    {
      id: "context",
      label: t("tabContext"),
      content:
        contextSections.length > 0 ? (
          <div className="space-y-4">
            {contextSections.map((section) => (
              <GunimiContextCard
                key={section.id}
                title={section.title}
                icon={section.icon}
                entries={section.entries}
              />
            ))}
          </div>
        ) : (
          <GunimiEmptyState
            title={t("contextEmptyTitle")}
            description={t("contextEmptyDescription")}
            icon={Users}
          />
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <ContactHeader contact={contact} allTags={allTags} entityTags={entityTags} />
      <GunimiWorkspaceTabs
        tabs={tabs}
        defaultTab="overview"
        listLabel={t("workspaceTabsLabel")}
      />
    </div>
  );
}
