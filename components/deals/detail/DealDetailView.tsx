"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import DealHeader from "./DealHeader";
import DealOverview from "./DealOverview";
import DealNotes from "./DealNotes";
import DealTasks from "./DealTasks";
import DealIntelligence from "./DealIntelligence";
import EditDealSheet from "@/components/deals/EditDealSheet";
import GunimiWorkspaceTabs from "@/components/ui/GunimiWorkspaceTabs";
import GunimiDecisionCard from "@/components/ui/GunimiDecisionCard";
import GunimiPreparationCard, { type PreparationItem } from "@/components/ui/GunimiPreparationCard";
import GunimiStory, { type RenderedStoryEvent } from "@/components/ui/GunimiStory";
import GunimiContextCard, { type ContextEntry } from "@/components/ui/GunimiContextCard";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import type { WorkspaceTab } from "@/components/ui/GunimiWorkspaceTabs";

import { resolveDealDecision } from "@/lib/deals/decision";
import { resolveDealPreparation, type PrepItem } from "@/lib/deals/preparation";
import { resolveDealStory } from "@/lib/deals/story";
import { resolveDealContext } from "@/lib/deals/context";

import { User, Clock, CheckSquare, FileText, LucideIcon, Users, CalendarDays, TrendingUp, ShoppingBag } from "lucide-react";
import OpenTasksStrip from "@/components/tasks/OpenTasksStrip";
import WorkspaceTimeline from "@/components/timeline/WorkspaceTimeline";

import { Deal } from "@/types/deal";
import { WorkspaceActivity } from "@/types/activity";
import { Company } from "@/types/company";
import { Contact } from "@/types/contact";
import type { DealRelatedNote } from "@/server/actions/deals/getDealRelatedNotes";
import type { DealRelatedTask } from "@/server/actions/deals/getDealRelatedTasks";
import type { WorkspaceDealStage } from "@/types/dealStage";
import type { WorkspaceTag } from "@/types/tag";
import type { WorkspaceAttachment } from "@/server/actions/attachments/getAttachments";
import AttachmentsPanel from "@/components/attachments/AttachmentsPanel";
import ResponsibilitiesPanel from "@/components/organization/ResponsibilitiesPanel";
import type { WorkspaceTeam } from "@/types/organization";
import type { WorkspaceMember } from "@/types/task";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_STYLES } from "@/lib/orders/styles";
import { formatOrderAmount, computeOrderTotal, type Order } from "@/types/order";

const PREP_ICONS: Record<PrepItem["iconKey"], LucideIcon> = {
  contact: User,
  activity: Clock,
  task: CheckSquare,
  note: FileText,
};

const CONTEXT_ICONS: Record<"relationships" | "notes" | "tasks" | "meeting" | "deals", LucideIcon> = {
  relationships: Users,
  notes: FileText,
  tasks: CheckSquare,
  meeting: CalendarDays,
  deals: TrendingUp,
};

type Props = {
  deal: Deal;
  activities: WorkspaceActivity[];
  companies: Company[];
  contacts: Contact[];
  notes: DealRelatedNote[];
  tasks: DealRelatedTask[];
  stages: WorkspaceDealStage[];
  allTags: WorkspaceTag[];
  entityTags: WorkspaceTag[];
  attachments: WorkspaceAttachment[];
  teams: WorkspaceTeam[];
  members: WorkspaceMember[];
  orders: Order[];
};

export default function DealDetailView({
  deal,
  activities,
  companies,
  contacts,
  notes,
  tasks,
  stages,
  allTags,
  entityTags,
  attachments,
  teams,
  members,
  orders,
}: Props) {
  const router = useRouter();
  const t = useTranslations("deals");
  const tOrders = useTranslations("orders");
  const [editOpen, setEditOpen] = useState(false);
  const [localTasks, setLocalTasks] = useState(tasks);

  const pendingTasksCount = localTasks.filter((task) => task.status !== "done").length;

  const decision = useMemo(() => resolveDealDecision(deal, tasks), [deal, tasks]);
  const rawPrep = useMemo(
    () => resolveDealPreparation(deal, tasks, activities, notes, decision),
    [deal, tasks, activities, notes, decision],
  );
  const rawStory = useMemo(() => resolveDealStory(deal, activities), [deal, activities]);
  const rawContext = useMemo(
    () => resolveDealContext(deal, notes, tasks, activities),
    [deal, notes, tasks, activities],
  );

  const decisionAction = decision ? t(decision.actionKey) : t("decisionEmptyLabel");
  const decisionReason = decision
    ? t(decision.reasonKey, decision.reasonParams ?? {})
    : t("decisionEmptyReason");

  const decisionHref: string | undefined = (() => {
    switch (decision?.action) {
      case "follow_up":
      case "overdue_tasks":
      case "prepare_close":
      case "update_close_date":
      case "set_close_date":
        return "/dashboard/tasks";
      default:
        return undefined;
    }
  })();

  const decisiononClick: (() => void) | undefined = (() => {
    switch (decision?.action) {
      case "link_company":
      case "link_contact":
        return () => setEditOpen(true);
      default:
        return undefined;
    }
  })();

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
          <DealIntelligence deal={deal} activeDecisionAction={decision?.action} />
          <GunimiDecisionCard
            label={t("decisionSuggestedLabel")}
            action={decisionAction}
            reason={decisionReason}
            isEmpty={!decision}
            href={decisionHref}
            onClick={decisiononClick}
          />
          {preparationItems.length > 0 && (
            <GunimiPreparationCard
              label={t("preparationLabel")}
              items={preparationItems}
            />
          )}
          <OpenTasksStrip
            tasks={localTasks}
            contactId={deal.contact?.id ?? null}
            onTaskCreated={(task) =>
              setLocalTasks((prev) => [
                { ...task, description: null, created_at: new Date().toISOString() },
                ...prev,
              ])
            }
          />
          <DealOverview deal={deal} />
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
          earlyNoteDescription={activities.length === 0 ? t("storyEarlyDescription") : undefined}
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
          attachments={attachments}
        />
      ),
    },
    {
      id: "work",
      label: t("tabWork"),
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      content: (
        <div className="space-y-6">
          <ResponsibilitiesPanel entityType="deal" entityId={deal.id} teams={teams} />
          <DealTasks
            tasks={localTasks}
            contactId={deal.contact?.id}
            members={members}
            onTaskCreated={(task) => setLocalTasks((prev) => [task, ...prev])}
          />
          <DealNotes
            notes={notes}
            contactId={deal.contact?.id}
            companyId={deal.company?.id}
          />
          <AttachmentsPanel
            entityType="deal"
            entityId={deal.id}
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
            icon={Users}
            title={t("contextEmptyTitle")}
            description={t("contextEmptyDescription")}
          />
        ),
    },
    {
      id: "orders",
      label: t("tabOrders"),
      badge: orders.length || undefined,
      content: orders.length === 0 ? (
        <GunimiEmptyState
          icon={ShoppingBag}
          title={t("ordersEmpty")}
          description={t("ordersEmptyDescription")}
        />
      ) : (
        <div className="overflow-hidden overflow-x-auto rounded-2xl border border-white/[0.06] bg-[#080C14]">
          <table className="w-full min-w-[480px] text-sm">
            <tbody className="divide-y divide-white/[0.03]">
              {orders.map((order) => {
                const total = order.items ? computeOrderTotal(order.items) : null;
                return (
                  <tr
                    key={order.id}
                    className="group cursor-pointer transition-colors hover:bg-white/[0.02]"
                    onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-white/90 group-hover:text-white">
                          {order.title}
                        </span>
                        <span className="text-[11px] text-zinc-600">{order.number}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex w-fit rounded-full border px-2 py-0.5 text-[10px] font-medium",
                          ORDER_STATUS_STYLES[order.status] ?? ORDER_STATUS_STYLES.draft
                        )}
                      >
                        {tOrders(`status.${order.status}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-white/60 text-xs">
                      {total !== null ? formatOrderAmount(total, order.currency) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DealHeader deal={deal} onEdit={() => setEditOpen(true)} allTags={allTags} entityTags={entityTags} />

      <GunimiWorkspaceTabs
        tabs={tabs}
        defaultTab="overview"
        listLabel={t("workspaceTabsLabel")}
      />

      <EditDealSheet
        key={deal.id}
        deal={deal}
        open={editOpen}
        onOpenChange={setEditOpen}
        companies={companies}
        contacts={contacts}
        stages={stages}
        onUpdated={() => router.refresh()}
        onDeleted={() => router.push("/dashboard/deals")}
      />
    </div>
  );
}
