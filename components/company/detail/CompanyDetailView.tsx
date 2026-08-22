"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  User,
  Clock,
  Briefcase,
  CheckSquare,
  FileText,
  Users,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";

import CompanyWorkspaceHeader from "./CompanyWorkspaceHeader";
import CompanyProfile from "./CompanyProfile";
import CompanyNotes from "@/components/company/CompanyNotes";
import CompanyEmails from "@/components/company/CompanyEmails";
import EditCompanySheet from "@/components/company/EditCompanySheet";
import AddContactToCompanySheet from "@/components/company/AddContactToCompanySheet";

import GunimiButton from "@/components/ui/GunimiButton";
import GunimiWorkspaceTabs, { type WorkspaceTab } from "@/components/ui/GunimiWorkspaceTabs";
import GunimiDecisionCard from "@/components/ui/GunimiDecisionCard";
import GunimiPreparationCard, { type PreparationItem } from "@/components/ui/GunimiPreparationCard";
import GunimiStory, { type RenderedStoryEvent } from "@/components/ui/GunimiStory";
import GunimiContextCard, { type ContextEntry } from "@/components/ui/GunimiContextCard";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";

import { resolveCompanyDecision } from "@/lib/companies/decision";
import { resolveCompanyPreparation, type CompanyPrepItem } from "@/lib/companies/preparation";
import { resolveCompanyStory } from "@/lib/companies/story";
import { resolveCompanyContext } from "@/lib/companies/context";

import type { Company } from "@/types/company";
import type { Contact } from "@/types/contact";
import type { Deal } from "@/types/deal";
import type { WorkspaceActivity } from "@/types/activity";
import type { CompanyNote } from "@/server/actions/company/getCompanyNotes";
import type { EmailThread } from "@/types/email";
import type { WorkspaceTag } from "@/types/tag";
import type { WorkspaceAttachment } from "@/server/actions/attachments/getAttachments";
import type { CompanyTask } from "@/server/actions/company/getCompanyTasks";
import AttachmentsPanel from "@/components/attachments/AttachmentsPanel";
import ResponsibilitiesPanel from "@/components/organization/ResponsibilitiesPanel";
import type { WorkspaceTeam } from "@/types/organization";
import OpenTasksStrip from "@/components/tasks/OpenTasksStrip";
import WorkspaceTimeline from "@/components/timeline/WorkspaceTimeline";

const PREP_ICONS: Record<CompanyPrepItem["iconKey"], LucideIcon> = {
  contact: User,
  activity: Clock,
  deal: Briefcase,
};

const CONTEXT_ICONS: Record<"relationships" | "notes" | "tasks" | "meeting" | "deals", LucideIcon> = {
  relationships: Users,
  notes: FileText,
  tasks: CheckSquare,
  meeting: CalendarDays,
  deals: Briefcase,
};

type Props = {
  company: Company;
  contacts: Contact[];
  deals: Deal[];
  activities: WorkspaceActivity[];
  notes: CompanyNote[];
  emails: EmailThread[];
  tasks: CompanyTask[];
  allTags: WorkspaceTag[];
  entityTags: WorkspaceTag[];
  attachments: WorkspaceAttachment[];
  teams: WorkspaceTeam[];
};

export default function CompanyDetailView({
  company,
  contacts,
  deals,
  activities,
  notes,
  emails,
  tasks,
  allTags,
  entityTags,
  attachments,
  teams,
}: Props) {
  const router = useRouter();
  const t = useTranslations("companies");
  const [editOpen, setEditOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [localTasks, setLocalTasks] = useState(tasks);

  const workBadge = notes.length + emails.length || undefined;

  const decision = useMemo(
    () => resolveCompanyDecision(company, contacts, deals),
    [company, contacts, deals],
  );

  const rawPrep = useMemo(
    () => resolveCompanyPreparation(activities, decision),
    [activities, decision],
  );

  const rawStory = useMemo(
    () => resolveCompanyStory(company, activities),
    [company, activities],
  );

  const rawContext = useMemo(
    () => resolveCompanyContext(contacts, deals, activities, notes),
    [contacts, deals, activities, notes],
  );

  const decisionAction = decision ? t(decision.actionKey) : t("decisionEmptyLabel");
  const decisionReason = decision
    ? t(decision.reasonKey, decision.reasonParams ?? {})
    : t("decisionEmptyReason");

  const preparationItems: PreparationItem[] = useMemo(
    () =>
      rawPrep.map((item) => ({
        icon: PREP_ICONS[item.iconKey],
        label: t(item.labelKey),
        value: item.value,
        href: item.href,
        secondary: item.secondaryKey
          ? t(item.secondaryKey, item.secondaryParams ?? {})
          : item.secondaryRaw,
      })),
    [rawPrep, t],
  );

  const storyEvents: RenderedStoryEvent[] = useMemo(
    () =>
      rawStory.map((event) => ({
        id: event.id,
        iconKey: event.iconKey,
        badge: t(event.badgeKey),
        title: event.titleRaw ?? (event.titleKey ? t(event.titleKey, event.titleParams ?? {}) : ""),
        detail: event.detail,
        who: event.who,
        date: event.date,
      })),
    [rawStory, t],
  );

  const contextSections = useMemo(
    () =>
      rawContext.map((section) => ({
        id: section.id,
        title: t(section.titleKey),
        icon: CONTEXT_ICONS[section.iconKey],
        entries: section.entries.map((entry): ContextEntry => ({
          id: entry.id,
          label: entry.labelKey ? t(entry.labelKey) : undefined,
          primary: entry.primary,
          secondary: entry.secondary,
          href: entry.href,
          meta: entry.metaRaw,
        })),
      })),
    [rawContext, t],
  );

  const tabs: WorkspaceTab[] = [
    {
      id: "overview",
      label: t("tabOverview"),
      content: (
        <div className="space-y-4">
          <GunimiDecisionCard
            label={t("decisionSuggestedLabel")}
            action={decisionAction}
            reason={decisionReason}
            isEmpty={!decision}
            onClick={decision?.action === "no_contacts" ? () => setAddContactOpen(true) : undefined}
            href={(() => {
              switch (decision?.action) {
                case "closing_deal": return "/dashboard/deals";
                case "stale_relationship": return "/dashboard/tasks";
                case "no_contacts": return undefined;
                case "no_active_deals": return "/dashboard/deals";
                default: return undefined;
              }
            })()}
          />
          {preparationItems.length > 0 && (
            <GunimiPreparationCard label={t("preparationLabel")} items={preparationItems} />
          )}
          <OpenTasksStrip
            tasks={localTasks}
            onTaskCreated={(task) =>
              setLocalTasks((prev) => [
                { ...task, description: null, created_at: new Date().toISOString() },
                ...prev,
              ])
            }
          />
          <CompanyProfile company={company} />
        </div>
      ),
    },
    {
      id: "story",
      label: t("tabStory"),
      content: (
        <GunimiStory
          label={t("storyLabel")}
          events={storyEvents}
          earlyNoteTitle={activities.length === 0 ? t("storyEarlyTitle") : undefined}
          earlyNoteDescription={
            activities.length === 0 ? t("storyEarlyDescription") : undefined
          }
        />
      ),
    },
    {
      id: "history",
      label: t("tabHistory"),
      content: (
        <WorkspaceTimeline
          activities={activities}
          notes={notes}
          tasks={localTasks}
          emails={emails}
          deals={deals}
          attachments={attachments}
        />
      ),
    },
    {
      id: "work",
      label: t("tabWork"),
      badge: workBadge,
      content: (
        <div className="space-y-6">
          <ResponsibilitiesPanel entityType="company" entityId={company.id} teams={teams} />
          <CompanyNotes companyId={company.id} notes={notes} />
          <CompanyEmails threads={emails} />
          <AttachmentsPanel
            entityType="company"
            entityId={company.id}
            initialAttachments={attachments}
          />
        </div>
      ),
    },
    {
      id: "context",
      label: t("tabContext"),
      content: (
        <div className="space-y-4">
          <div className="flex justify-end">
            <GunimiButton
              variant="secondary"
              onClick={() => setAddContactOpen(true)}
              className="gap-1.5 px-3 py-2 text-xs"
            >
              {t("addContactAction")}
            </GunimiButton>
          </div>
          {contextSections.length > 0 ? (
            contextSections.map((section) => (
              <GunimiContextCard
                key={section.id}
                title={section.title}
                icon={section.icon}
                entries={section.entries}
              />
            ))
          ) : (
            <GunimiEmptyState
              icon={Users}
              title={t("contextEmptyTitle")}
              description={t("contextEmptyDescription")}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <CompanyWorkspaceHeader
        company={company}
        contacts={contacts}
        deals={deals}
        onEdit={() => setEditOpen(true)}
        allTags={allTags}
        entityTags={entityTags}
      />

      <GunimiWorkspaceTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        listLabel={t("workspaceTabsLabel")}
      />

      <EditCompanySheet
        key={company.id}
        company={company}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={() => router.refresh()}
      />

      <AddContactToCompanySheet
        companyId={company.id}
        companyName={company.name ?? ""}
        open={addContactOpen}
        onOpenChange={setAddContactOpen}
        onAdded={() => router.refresh()}
      />
    </div>
  );
}
