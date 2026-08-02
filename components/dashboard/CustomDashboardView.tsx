"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  Activity,
  AlertCircle,
  BarChart2,
  Building2,
  CalendarCheck,
  CheckSquare,
  ChevronRight,
  GripVertical,
  LayoutGrid,
  Plus,
  StickyNote,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import GunimiSection from "@/components/layout/GunimiSection";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiCard from "@/components/ui/GunimiCard";
import GunimiButton from "@/components/ui/GunimiButton";

import { saveDashboardLayout } from "@/server/actions/dashboard/saveDashboardLayout";
import type { DashboardData } from "@/server/actions/dashboard/getDashboardData";

// ─────────────────────────────────────────────────────────────────────────────
// Widget registry
// ─────────────────────────────────────────────────────────────────────────────

export type WidgetId =
  | "contacts_total"
  | "companies_total"
  | "pipeline_value"
  | "won_mtd"
  | "tasks_overdue"
  | "tasks_today"
  | "active_deals"
  | "deals_by_stage"
  | "tasks_week"
  | "recent_notes"
  | "recent_activity"
  | "recent_contacts";

export type WidgetSize = "sm" | "md" | "lg";
export type WidgetCategory = "relationships" | "sales" | "work";

type WidgetDef = {
  id: WidgetId;
  size: WidgetSize;
  category: WidgetCategory;
  labelKey: string;
  descKey: string;
  icon: React.ElementType;
};

const WIDGET_DEFS: WidgetDef[] = [
  // Relationships
  { id: "contacts_total",   size: "sm", category: "relationships", labelKey: "widgetContactsTotal",   descKey: "widgetContactsTotalDesc",   icon: Users       },
  { id: "companies_total",  size: "sm", category: "relationships", labelKey: "widgetCompaniesTotal",  descKey: "widgetCompaniesTotalDesc",  icon: Building2   },
  { id: "recent_contacts",  size: "md", category: "relationships", labelKey: "widgetRecentContacts",  descKey: "widgetRecentContactsDesc",  icon: Users       },
  { id: "recent_activity",  size: "lg", category: "relationships", labelKey: "widgetRecentActivity",  descKey: "widgetRecentActivityDesc",  icon: Activity    },
  // Sales
  { id: "pipeline_value",   size: "sm", category: "sales",         labelKey: "widgetPipelineValue",   descKey: "widgetPipelineValueDesc",   icon: TrendingUp  },
  { id: "won_mtd",          size: "sm", category: "sales",         labelKey: "widgetWonMtd",          descKey: "widgetWonMtdDesc",          icon: Zap         },
  { id: "active_deals",     size: "md", category: "sales",         labelKey: "widgetActiveDeals",     descKey: "widgetActiveDealsDesc",     icon: BarChart2   },
  { id: "deals_by_stage",   size: "md", category: "sales",         labelKey: "widgetDealsByStage",    descKey: "widgetDealsByStageDesc",    icon: BarChart2   },
  // Work
  { id: "tasks_today",      size: "sm", category: "work",          labelKey: "widgetTasksToday",      descKey: "widgetTasksTodayDesc",      icon: CalendarCheck },
  { id: "tasks_overdue",    size: "sm", category: "work",          labelKey: "widgetTasksOverdue",    descKey: "widgetTasksOverdueDesc",    icon: AlertCircle },
  { id: "tasks_week",       size: "md", category: "work",          labelKey: "widgetTasksWeek",       descKey: "widgetTasksWeekDesc",       icon: CheckSquare },
  { id: "recent_notes",     size: "md", category: "work",          labelKey: "widgetRecentNotes",     descKey: "widgetRecentNotesDesc",     icon: StickyNote  },
];

const DEFAULT_WIDGET_ORDER: WidgetId[] = [
  "contacts_total",
  "companies_total",
  "pipeline_value",
  "won_mtd",
  "tasks_today",
  "tasks_overdue",
  "active_deals",
  "deals_by_stage",
  "tasks_week",
  "recent_contacts",
  "recent_notes",
  "recent_activity",
];

// ─────────────────────────────────────────────────────────────────────────────
// Size → grid col-span classes
// ─────────────────────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<WidgetSize, string> = {
  sm: "col-span-1",
  md: "col-span-1 sm:col-span-2",
  lg: "col-span-1 sm:col-span-2 lg:col-span-3",
};

// ─────────────────────────────────────────────────────────────────────────────
// Widget content renderers
// ─────────────────────────────────────────────────────────────────────────────

function formatCurrency(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
  return String(val);
}

function MetricWidget({ value, label, sub }: { value: string | number; label: string; sub?: string }) {
  return (
    <div className="flex flex-col">
      <p className="text-3xl font-semibold tracking-tight text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
      <p className="mt-3 text-xs text-zinc-500">{label}</p>
    </div>
  );
}

function WidgetContent({ id, data, t }: { id: WidgetId; data: DashboardData; t: ReturnType<typeof useTranslations> }) {
  switch (id) {
    case "contacts_total":
      return <MetricWidget value={data.contactsTotal} label={t("widgetContactsTotal")} />;

    case "companies_total":
      return <MetricWidget value={data.companiesTotal} label={t("widgetCompaniesTotal")} />;

    case "pipeline_value":
      return <MetricWidget value={`€${formatCurrency(data.pipelineValue)}`} label={t("widgetPipelineValue")} sub={t("widgetPipelineValueSub")} />;

    case "won_mtd":
      return (
        <MetricWidget
          value={data.wonMtdCount}
          label={t("widgetWonMtd")}
          sub={data.wonMtdValue > 0 ? `€${formatCurrency(data.wonMtdValue)}` : undefined}
        />
      );

    case "tasks_today":
      return <MetricWidget value={data.tasksTodayCount} label={t("widgetTasksToday")} />;

    case "tasks_overdue":
      return (
        <MetricWidget
          value={data.tasksOverdueCount}
          label={t("widgetTasksOverdue")}
        />
      );

    case "active_deals":
      if (data.activeDeals.length === 0) {
        return <p className="text-xs text-white/25">{t("widgetEmpty")}</p>;
      }
      return (
        <ul className="space-y-2">
          {data.activeDeals.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white/80">{d.title}</p>
                {d.company_name && (
                  <p className="truncate text-xs text-zinc-600">{d.company_name}</p>
                )}
              </div>
              {d.value != null && (
                <span className="shrink-0 text-xs font-semibold text-violet-400">
                  €{formatCurrency(d.value)}
                </span>
              )}
            </li>
          ))}
        </ul>
      );

    case "deals_by_stage":
      if (data.dealsByStage.length === 0) {
        return <p className="text-xs text-white/25">{t("widgetEmpty")}</p>;
      }
      return (
        <ul className="space-y-2">
          {data.dealsByStage.map((s) => (
            <li key={s.stage} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs capitalize text-white/60">{s.stage}</span>
                  <span className="text-xs font-semibold text-white/70">{s.count}</span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-500/60"
                    style={{ width: `${Math.min(100, (s.count / Math.max(...data.dealsByStage.map(x => x.count), 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      );

    case "tasks_week":
      if (data.tasksWeek.length === 0) {
        return <p className="text-xs text-white/25">{t("widgetEmpty")}</p>;
      }
      return (
        <ul className="space-y-2">
          {data.tasksWeek.slice(0, 5).map((task) => (
            <li key={task.id} className="flex items-center gap-2.5">
              <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/60" />
              <span className="truncate text-sm text-white/70">{task.title}</span>
              {task.due_date && (
                <span className="ml-auto shrink-0 text-xs text-zinc-600">
                  {task.due_date.slice(5, 10)}
                </span>
              )}
            </li>
          ))}
        </ul>
      );

    case "recent_contacts":
      if (data.recentContacts.length === 0) {
        return <p className="text-xs text-white/25">{t("widgetEmpty")}</p>;
      }
      return (
        <ul className="space-y-2">
          {data.recentContacts.map((c) => (
            <li key={c.id} className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-semibold text-violet-300">
                {c.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-white/75">{c.name}</p>
                {c.email && <p className="truncate text-xs text-zinc-600">{c.email}</p>}
              </div>
            </li>
          ))}
        </ul>
      );

    case "recent_notes":
      if (data.recentNotes.length === 0) {
        return <p className="text-xs text-white/25">{t("widgetEmpty")}</p>;
      }
      return (
        <ul className="space-y-2">
          {data.recentNotes.map((n) => (
            <li key={n.id} className="flex items-center gap-2">
              <StickyNote size={12} className="shrink-0 text-zinc-600" />
              <span className="truncate text-sm text-white/70">{n.title}</span>
              <span className="ml-auto shrink-0 text-xs text-zinc-600">
                {n.created_at.slice(5, 10)}
              </span>
            </li>
          ))}
        </ul>
      );

    case "recent_activity":
      if (data.recentActivity.length === 0) {
        return <p className="text-xs text-white/25">{t("widgetEmpty")}</p>;
      }
      return (
        <ul className="space-y-2">
          {data.recentActivity.map((a) => (
            <li key={a.id} className="flex items-center gap-2.5">
              <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />
              <span className="truncate text-sm text-white/60">{a.title}</span>
              <span className="ml-auto shrink-0 text-xs text-zinc-700">
                {a.created_at.slice(5, 10)}
              </span>
            </li>
          ))}
        </ul>
      );

    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Widget card
// ─────────────────────────────────────────────────────────────────────────────

function WidgetCard({
  def,
  data,
  t,
  editMode,
  isDragging,
  isOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onRemove,
}: {
  def: WidgetDef;
  data: DashboardData;
  t: ReturnType<typeof useTranslations>;
  editMode: boolean;
  isDragging: boolean;
  isOver: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onRemove: () => void;
}) {
  const Icon = def.icon;

  return (
    <div
      className={`${SIZE_CLASSES[def.size]} transition-all duration-200 ${
        isDragging ? "opacity-30 scale-95" : ""
      } ${isOver && !isDragging ? "ring-2 ring-violet-500/40 rounded-2xl" : ""}`}
      draggable={editMode}
      onDragStart={editMode ? onDragStart : undefined}
      onDragOver={editMode ? onDragOver : undefined}
      onDrop={editMode ? onDrop : undefined}
      onDragEnd={editMode ? onDragEnd : undefined}
    >
      <GunimiCard className={`relative h-full p-5 ${editMode ? "cursor-grab active:cursor-grabbing" : ""}`}>
        {/* Edit-mode overlay controls */}
        {editMode && (
          <div className="absolute right-2 top-2 flex items-center gap-1 z-10">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg text-white/20">
              <GripVertical size={12} />
            </div>
            <button
              onClick={onRemove}
              aria-label="Remove widget"
              className="flex h-6 w-6 items-center justify-center rounded-lg text-white/20 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <X size={11} aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Widget header */}
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04]" aria-hidden="true">
            <Icon size={13} className="text-zinc-500" />
          </div>
          <p className="text-xs font-medium text-zinc-500">{t(def.labelKey as Parameters<typeof t>[0])}</p>
        </div>

        {/* Widget content */}
        <WidgetContent id={def.id} data={data} t={t} />
      </GunimiCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Widget catalog (add panel)
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_ORDER: WidgetCategory[] = ["relationships", "sales", "work"];

function WidgetCatalog({
  activeIds,
  onAdd,
  onClose,
  t,
}: {
  activeIds: WidgetId[];
  onAdd: (id: WidgetId) => void;
  onClose: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex h-full w-full max-w-sm flex-col border-l border-white/[0.06] bg-zinc-950 shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{t("catalog")}</p>
            <p className="mt-0.5 text-sm font-semibold text-white/90">{t("addWidget")}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white/25 transition-colors hover:bg-white/[0.06] hover:text-white/70"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {CATEGORY_ORDER.map((cat) => {
            const widgets = WIDGET_DEFS.filter((w) => w.category === cat);
            return (
              <div key={cat}>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                  {t(`category_${cat}` as Parameters<typeof t>[0])}
                </p>
                <div className="space-y-2">
                  {widgets.map((w) => {
                    const Icon = w.icon;
                    const isActive = activeIds.includes(w.id);
                    return (
                      <button
                        key={w.id}
                        disabled={isActive}
                        onClick={() => { onAdd(w.id); onClose(); }}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                          isActive
                            ? "border-white/[0.04] bg-white/[0.02] opacity-40 cursor-default"
                            : "border-white/[0.06] bg-white/[0.02] hover:border-violet-500/30 hover:bg-violet-500/[0.04]"
                        }`}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                          <Icon size={13} className="text-zinc-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-white/75">{t(w.labelKey as Parameters<typeof t>[0])}</p>
                          <p className="mt-0.5 text-[11px] text-zinc-600">{t(w.descKey as Parameters<typeof t>[0])}</p>
                        </div>
                        {isActive ? (
                          <span className="shrink-0 text-[10px] text-zinc-600">{t("alreadyAdded")}</span>
                        ) : (
                          <Plus size={12} className="shrink-0 text-zinc-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main view
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  data: DashboardData;
  savedWidgets: string[] | null;
};

export default function CustomDashboardView({ data, savedWidgets }: Props) {
  const t = useTranslations("customDashboard");

  const initialOrder: WidgetId[] =
    savedWidgets?.filter((id): id is WidgetId => WIDGET_DEFS.some((w) => w.id === id)) ??
    DEFAULT_WIDGET_ORDER;

  const [widgetOrder, setWidgetOrder] = useState<WidgetId[]>(initialOrder);
  const [editMode, setEditMode] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [isSaving, startSave] = useTransition();

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  // ── Drag-and-drop handlers ──────────────────────────────────────────────
  function handleDragStart(idx: number) {
    setDragIdx(idx);
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    setOverIdx(idx);
  }

  function handleDrop(targetIdx: number) {
    setDragIdx((from) => {
      if (from === null || from === targetIdx) return null;
      setWidgetOrder((prev) => {
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        next.splice(targetIdx, 0, moved);
        return next;
      });
      return null;
    });
    setOverIdx(null);
  }

  function handleDragEnd() {
    setDragIdx(null);
    setOverIdx(null);
  }

  // ── Widget management ───────────────────────────────────────────────────
  function addWidget(id: WidgetId) {
    setWidgetOrder((prev) => [...prev, id]);
  }

  function removeWidget(id: WidgetId) {
    setWidgetOrder((prev) => prev.filter((w) => w !== id));
  }

  // ── Save layout ─────────────────────────────────────────────────────────
  function handleSave() {
    startSave(async () => {
      const result = await saveDashboardLayout(widgetOrder);
      if (result.success) {
        toast.success(t("saved"));
        setEditMode(false);
      } else {
        toast.error(t("saveFailed"));
      }
    });
  }

  function handleDiscard() {
    setWidgetOrder(initialOrder);
    setEditMode(false);
  }

  const defs = widgetOrder
    .map((id) => WIDGET_DEFS.find((w) => w.id === id))
    .filter((d): d is WidgetDef => !!d);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <GunimiSection>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <GunimiHeading
            badge={t("badge")}
            title={t("title")}
            subtitle={t("subtitle")}
          />
          <div className="flex shrink-0 items-center gap-2 self-start">
            {editMode ? (
              <>
                <GunimiButton
                  variant="secondary"
                  onClick={() => setCatalogOpen(true)}
                >
                  <Plus size={14} />
                  {t("addWidget")}
                </GunimiButton>
                <GunimiButton
                  variant="secondary"
                  onClick={handleDiscard}
                  disabled={isSaving}
                >
                  {t("discard")}
                </GunimiButton>
                <GunimiButton
                  onClick={handleSave}
                  loading={isSaving}
                >
                  {t("saveLayout")}
                </GunimiButton>
              </>
            ) : (
              <GunimiButton variant="secondary" onClick={() => setEditMode(true)}>
                <LayoutGrid size={14} />
                {t("customize")}
              </GunimiButton>
            )}
          </div>
        </div>
      </GunimiSection>

      {/* Edit mode banner */}
      {editMode && (
        <GunimiSection>
          <div className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] px-4 py-3">
            <GripVertical size={14} className="shrink-0 text-violet-400" />
            <p className="text-sm text-violet-300/80">{t("editModeBanner")}</p>
            <Link
              href="#"
              onClick={(e) => { e.preventDefault(); setCatalogOpen(true); }}
              className="ml-auto shrink-0 flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              {t("addWidget")}
              <ChevronRight size={12} />
            </Link>
          </div>
        </GunimiSection>
      )}

      {/* Widget grid */}
      <GunimiSection>
        {defs.length === 0 ? (
          <GunimiCard className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03]">
              <LayoutGrid size={20} className="text-zinc-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white/40">{t("emptyTitle")}</p>
              <p className="mt-1 text-xs text-zinc-600">{t("emptyDesc")}</p>
            </div>
            <GunimiButton onClick={() => { setEditMode(true); setCatalogOpen(true); }}>
              <Plus size={14} />
              {t("addFirstWidget")}
            </GunimiButton>
          </GunimiCard>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {defs.map((def, idx) => (
              <WidgetCard
                key={def.id}
                def={def}
                data={data}
                t={t}
                editMode={editMode}
                isDragging={dragIdx === idx}
                isOver={overIdx === idx && dragIdx !== null && dragIdx !== idx}
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={() => handleDrop(idx)}
                onDragEnd={handleDragEnd}
                onRemove={() => removeWidget(def.id)}
              />
            ))}
          </div>
        )}
      </GunimiSection>

      {/* Catalog panel */}
      {catalogOpen && (
        <WidgetCatalog
          activeIds={widgetOrder}
          onAdd={addWidget}
          onClose={() => setCatalogOpen(false)}
          t={t}
        />
      )}
    </div>
  );
}
