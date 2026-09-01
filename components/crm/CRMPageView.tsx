"use client";

import { useMemo, useState, useTransition } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  CheckSquare,
  ChevronRight,
  FileUp,
  Pencil,
  Search,
  Square,
  Star,
  Trash2,
  UserPlus,
  Users,
  TrendingUp,
} from "lucide-react";

import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import { deleteContact } from "@/server/actions/crm/deleteContact";
import { toggleContactPriority } from "@/server/actions/crm/toggleContactPriority";
import { getTags } from "@/server/actions/tags/getTags";

import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiInput from "@/components/ui/GunimiInput";
import GunimiSection from "@/components/layout/GunimiSection";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import GunimiStatCard from "@/components/ui/GunimiStatCard";

import CreateContactSheet from "@/components/crm/CreateContactSheet";
import EditContactSheet from "@/components/crm/EditContactSheet";
import BulkActionBar from "@/components/crm/BulkActionBar";
import MergeContactSheet from "@/components/crm/MergeContactSheet";

import { TAG_COLOR_CLASSES, type WorkspaceTag } from "@/types/tag";
import type { ContactTagsMap } from "@/server/actions/crm/getWorkspaceContactTagsMap";
import type { ContactsHealthMap } from "@/server/actions/relationships/getContactsHealthMap";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortOrder = "priority" | "name_asc" | "name_desc" | "newest" | "oldest";

type Contact = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  notes?: string | null;
  status?: string | null;
  company_id?: string | null;
  companies?: { name: string } | null;
  is_priority?: boolean;
  created_at?: string | null;
};

type Props = {
  initialContacts: Contact[];
  initialContactTagsMap?: ContactTagsMap;
  healthMap?: ContactsHealthMap;
};

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_BORDER: Record<string, string> = {
  lead: "border-l-amber-500/70",
  won: "border-l-emerald-500/70",
  _other: "border-l-zinc-700/50",
};

const STATUS_DOT: Record<string, string> = {
  lead: "bg-amber-400",
  won: "bg-emerald-400",
  _other: "bg-zinc-600",
};

const STATUS_GROUPS = [
  { key: "lead", labelKey: "groupLeads", dotClass: "bg-amber-400" },
  { key: "won", labelKey: "groupWon", dotClass: "bg-emerald-400" },
  { key: "_other", labelKey: "groupOther", dotClass: "bg-zinc-600" },
] as const;

const MAX_VISIBLE_TAGS = 2;

// ─── Sub-components ───────────────────────────────────────────────────────────

function ContactAvatar({ name, isPriority }: { name: string; isPriority?: boolean }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-[11px] font-semibold text-violet-300">
      {initials}
      {isPriority && (
        <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#080C14]">
          <Star size={8} className="fill-amber-400 text-amber-400" />
        </span>
      )}
    </div>
  );
}

function ContactTagChips({ tags }: { tags: WorkspaceTag[] }) {
  if (!tags.length) return null;
  const visible = tags.slice(0, MAX_VISIBLE_TAGS);
  const overflow = tags.length - MAX_VISIBLE_TAGS;
  return (
    <div className="flex items-center gap-1">
      {visible.map((tag) => {
        const colorClass = TAG_COLOR_CLASSES[tag.color as keyof typeof TAG_COLOR_CLASSES] ?? TAG_COLOR_CLASSES.violet;
        return (
          <span
            key={tag.id}
            className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${colorClass}`}
          >
            {tag.name}
          </span>
        );
      })}
      {overflow > 0 && (
        <span className="text-[10px] text-zinc-600">+{overflow}</span>
      )}
    </div>
  );
}

function GroupHeader({
  label,
  count,
  dotClass,
  collapsed,
  onToggle,
}: {
  label: string;
  count: number;
  dotClass: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-2 px-4 py-2 text-left transition-colors hover:bg-white/[0.02]"
    >
      <ChevronRight
        size={13}
        className={`shrink-0 text-zinc-600 transition-transform duration-150 ${collapsed ? "" : "rotate-90"}`}
      />
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      <span className="ml-1 rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-600">
        {count}
      </span>
    </button>
  );
}

function ContactRow({
  contact,
  tags,
  health,
  isSelected,
  onSelect,
  onNavigate,
  onPriority,
  onEdit,
  onDelete,
}: {
  contact: Contact;
  tags: WorkspaceTag[];
  health?: { score: number; dotClass: string; textClass: string; tierKey: string };
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onNavigate: () => void;
  onPriority: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const statusKey = contact.status === "lead" || contact.status === "won" ? contact.status : "_other";
  const borderClass = STATUS_BORDER[statusKey];
  const dotClass = STATUS_DOT[statusKey];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onNavigate}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNavigate(); } }}
      className={[
        "group relative flex cursor-pointer items-center gap-3 border-l-2 px-4 py-2.5 transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-violet-500/40",
        borderClass,
        isSelected ? "bg-violet-500/[0.05]" : "hover:bg-white/[0.025]",
      ].join(" ")}
    >
      {/* Checkbox */}
      <button
        onClick={onSelect}
        className="shrink-0 text-white/20 transition-colors hover:text-violet-300"
      >
        {isSelected
          ? <CheckSquare size={14} className="text-violet-400" />
          : <Square size={14} />}
      </button>

      {/* Avatar */}
      <ContactAvatar name={contact.name} isPriority={contact.is_priority} />

      {/* Name + sub */}
      <div className="min-w-0 flex-[2]">
        <p className="truncate text-sm font-medium text-white/85 transition-colors group-hover:text-violet-200">
          {contact.name}
        </p>
        <p className="truncate text-[11px] text-zinc-600">
          {contact.email ?? "—"}
        </p>
      </div>

      {/* Position */}
      <div className="hidden min-w-0 flex-1 sm:block">
        {contact.position ? (
          <p className="truncate text-xs text-zinc-500">{contact.position}</p>
        ) : (
          <span className="text-xs text-zinc-700">—</span>
        )}
      </div>

      {/* Company chip */}
      <div className="hidden min-w-0 flex-1 lg:block">
        {contact.companies?.name ? (
          <Link
            href={contact.company_id ? `/dashboard/companies/${contact.company_id}` : "#"}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[11px] text-zinc-400 transition-colors hover:border-violet-500/30 hover:text-violet-300"
          >
            {contact.companies.name}
          </Link>
        ) : (
          <span className="text-xs text-zinc-700">—</span>
        )}
      </div>

      {/* Tags */}
      <div className="hidden min-w-0 xl:block">
        <ContactTagChips tags={tags} />
      </div>

      {/* Status dot */}
      <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
        <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
        {contact.status && (
          <span className="text-[10px] capitalize text-zinc-600">{contact.status}</span>
        )}
      </div>

      {/* Health score */}
      {health && (
        <div className="hidden shrink-0 items-center gap-1 sm:flex">
          <span className={`h-1.5 w-1.5 rounded-full ${health.dotClass}`} />
          <span className={`text-[10px] tabular-nums ${health.textClass}`}>{health.score}</span>
        </div>
      )}

      {/* Actions — always visible on mobile, hover-only on desktop */}
      <div
        className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onPriority}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.06]"
          title="Priority"
        >
          <Star
            size={13}
            className={contact.is_priority ? "fill-amber-400 text-amber-400" : "text-white/30 hover:text-amber-300"}
          />
        </button>
        <button
          onClick={onEdit}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white/70"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CRMPageView({ initialContacts, initialContactTagsMap = {}, healthMap = {} }: Props) {
  const t = useTranslations("crm");
  const tc = useTranslations("common");
  const router = useRouter();

  // ── State (unchanged) ──
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [contactTagsMap] = useState<ContactTagsMap>(initialContactTagsMap);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [isDeleting, startDelete] = useTransition();
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [tags, setTags] = useState<WorkspaceTag[]>([]);
  const [tagsLoaded, setTagsLoaded] = useState(false);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "lead" | "won">("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("priority");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const [prevInitialContacts, setPrevInitialContacts] = useState(initialContacts);
  if (prevInitialContacts !== initialContacts) {
    setPrevInitialContacts(initialContacts);
    setContacts(initialContacts);
  }

  // ── Derived (unchanged logic) ──
  const filtered = useMemo(() => {
    let list = search
      ? contacts.filter(
          (c) =>
            c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.email?.toLowerCase().includes(search.toLowerCase())
        )
      : contacts;
    if (priorityOnly) list = list.filter((c) => c.is_priority);
    if (filterStatus !== "all") list = list.filter((c) => c.status === filterStatus);
    const sorted = [...list];
    if (sortOrder === "priority") {
      sorted.sort((a, b) => (b.is_priority ? 1 : 0) - (a.is_priority ? 1 : 0));
    } else if (sortOrder === "name_asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "name_desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOrder === "newest") {
      sorted.sort((a, b) => new Date(b.created_at ?? "").getTime() - new Date(a.created_at ?? "").getTime());
    } else if (sortOrder === "oldest") {
      sorted.sort((a, b) => new Date(a.created_at ?? "").getTime() - new Date(b.created_at ?? "").getTime());
    }
    return sorted;
  }, [contacts, search, priorityOnly, filterStatus, sortOrder]);

  const leadCount = useMemo(() => contacts.filter((c) => c.status === "lead").length, [contacts]);
  const wonCount = useMemo(() => contacts.filter((c) => c.status === "won").length, [contacts]);

  // Group only when no active filter/search — otherwise flat
  const shouldGroup = filterStatus === "all" && search === "" && !priorityOnly;

  // ── Handlers (unchanged) ──
  function toggleGroup(key: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  function toggleSelect(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
    if (!tagsLoaded) {
      setTagsLoaded(true);
      getTags().then(setTags).catch(() => {});
    }
  }

  function toggleSelectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((c) => c.id)));
      if (!tagsLoaded) {
        setTagsLoaded(true);
        getTags().then(setTags).catch(() => {});
      }
    }
  }

  function handleCreated(contact: Contact) {
    setContacts((prev) => [contact, ...prev]);
  }

  async function handleTogglePriority(contact: Contact, e: React.MouseEvent) {
    e.stopPropagation();
    const next = !contact.is_priority;
    setContacts((prev) => prev.map((c) => c.id === contact.id ? { ...c, is_priority: next } : c));
    await toggleContactPriority(contact.id, next);
  }

  function handleEditSaved(updated: Contact) {
    setContacts((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
    setEditContact(null);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    startDelete(async () => {
      const ok = await deleteContact(deleteTarget.id);
      if (ok) {
        toast.success(t("contactDeleted"));
        setContacts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast.error(t("failedToDeleteContact"));
      }
    });
  }

  // ── Row renderer ──
  function renderRow(contact: Contact) {
    return (
      <ContactRow
        key={contact.id}
        contact={contact}
        tags={contactTagsMap[contact.id] ?? []}
        health={healthMap[contact.id]}
        isSelected={selectedIds.has(contact.id)}
        onSelect={(e) => toggleSelect(contact.id, e)}
        onNavigate={() => router.push(`/dashboard/contacts/${contact.id}`)}
        onPriority={(e) => handleTogglePriority(contact, e)}
        onEdit={(e) => { e.stopPropagation(); setEditContact(contact); }}
        onDelete={(e) => { e.stopPropagation(); setDeleteTarget(contact); }}
      />
    );
  }

  // ─── JSX ─────────────────────────────────────────────────────────────────────
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
          <GunimiButton onClick={() => setCreateOpen(true)} className="shrink-0 self-start">
            <UserPlus size={15} />
            {t("createContact")}
          </GunimiButton>
        </div>
      </GunimiSection>

      {/* Stats — clickable filter */}
      <GunimiSection>
        <div className="grid gap-4 sm:grid-cols-3">
          <GunimiStatCard
            title={t("totalCustomers")}
            value={contacts.length}
            icon={Users}
            animated
            active={filterStatus === "all"}
            onClick={() => setFilterStatus("all")}
          />
          <GunimiStatCard
            title={t("activeLeads")}
            value={leadCount}
            icon={TrendingUp}
            animated
            active={filterStatus === "lead"}
            onClick={() => setFilterStatus(filterStatus === "lead" ? "all" : "lead")}
          />
          <GunimiStatCard
            title={t("wonDeals")}
            value={wonCount}
            icon={CheckSquare}
            animated
            active={filterStatus === "won"}
            onClick={() => setFilterStatus(filterStatus === "won" ? "all" : "won")}
          />
        </div>
      </GunimiSection>

      {/* Controls */}
      <GunimiSection>
        <div className="flex flex-wrap items-center gap-3">
          {/* Select all */}
          <button
            onClick={toggleSelectAll}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/25 transition-colors hover:text-violet-300"
            title={selectedIds.size === filtered.length && filtered.length > 0 ? t("bulkDeselectAll") : t("bulkSelectAll")}
          >
            {selectedIds.size === filtered.length && filtered.length > 0
              ? <CheckSquare size={15} className="text-violet-400" />
              : <Square size={15} />}
          </button>

          {/* Priority filter */}
          <button
            onClick={() => setPriorityOnly((v) => !v)}
            className={[
              "flex h-9 items-center gap-2 rounded-xl border px-3 text-sm transition-colors",
              priorityOnly
                ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-white/[0.12] hover:text-white/70",
            ].join(" ")}
          >
            <Star size={13} className={priorityOnly ? "fill-amber-400 text-amber-400" : ""} />
            {t("priorityOnly")}
          </button>

          {/* Sort */}
          <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
            <SelectTrigger className="h-9 w-auto min-w-[140px] px-3 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">{tc("sortPriority")}</SelectItem>
              <SelectItem value="name_asc">{tc("sortNameAz")}</SelectItem>
              <SelectItem value="name_desc">{tc("sortNameZa")}</SelectItem>
              <SelectItem value="newest">{tc("sortNewest")}</SelectItem>
              <SelectItem value="oldest">{tc("sortOldest")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="min-w-[180px] flex-1">
            <GunimiInput
              type="text"
              placeholder={t("searchCustomers")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Result count */}
          <span className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-500">
            {filtered.length} {t("results")}
          </span>
        </div>
      </GunimiSection>

      {/* Contact list */}
      <GunimiSection>
        {contacts.length === 0 ? (
          <GunimiEmptyState
            icon={Users}
            title={t("onboardingEmptyTitle")}
            description={t("onboardingEmptyDescription")}
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <GunimiButton onClick={() => setCreateOpen(true)}>
                  <UserPlus size={14} />
                  {t("onboardingCreateContact")}
                </GunimiButton>
                <Link href="/dashboard/import">
                  <GunimiButton variant="secondary">
                    <FileUp size={14} />
                    {t("onboardingImportCSV")}
                  </GunimiButton>
                </Link>
              </div>
            }
          />
        ) : filtered.length === 0 ? (
          <GunimiEmptyState icon={Search} title={t("noSearchResults")} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080C14]">
            {/* Table header */}
            <div className="flex items-center gap-3 border-b border-white/[0.05] px-4 py-2.5 pl-[52px]">
              <p className="flex-[2] text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">{t("contactName")}</p>
              <p className="hidden flex-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600 sm:block">{t("contactPosition")}</p>
              <p className="hidden flex-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600 lg:block">{t("company")}</p>
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600 xl:block" style={{ minWidth: 80 }}>Tags</p>
              <p className="hidden w-16 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600 sm:block">{t("status")}</p>
              <p className="hidden w-12 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600 sm:block">{t("health")}</p>
              <div className="w-[88px]" />
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/[0.04]">
              {shouldGroup ? (
                STATUS_GROUPS.map(({ key, labelKey, dotClass }) => {
                  const items = key === "_other"
                    ? filtered.filter((c) => c.status !== "lead" && c.status !== "won")
                    : filtered.filter((c) => c.status === key);
                  if (items.length === 0) return null;
                  const collapsed = collapsedGroups.has(key);
                  return (
                    <div key={key}>
                      <GroupHeader
                        label={t(labelKey)}
                        count={items.length}
                        dotClass={dotClass}
                        collapsed={collapsed}
                        onToggle={() => toggleGroup(key)}
                      />
                      {!collapsed && items.map(renderRow)}
                    </div>
                  );
                })
              ) : (
                filtered.map(renderRow)
              )}
            </div>
          </div>
        )}
      </GunimiSection>

      {/* Bulk Action Bar (unchanged) */}
      <BulkActionBar
        selectedIds={[...selectedIds]}
        selectedContacts={contacts.filter((c) => selectedIds.has(c.id))}
        tags={tags}
        onClear={() => setSelectedIds(new Set())}
        onDeleted={(ids) => setContacts((prev) => prev.filter((c) => !ids.includes(c.id)))}
        onMerge={() => setMergeOpen(true)}
      />

      {/* Merge sheet (unchanged) */}
      {mergeOpen && selectedIds.size === 2 && (() => {
        const pair = contacts.filter((c) => selectedIds.has(c.id)) as [typeof contacts[0], typeof contacts[0]];
        return (
          <MergeContactSheet
            contacts={pair}
            open={mergeOpen}
            onClose={() => setMergeOpen(false)}
            onMerged={() => {
              setContacts((prev) => {
                const ids = [...selectedIds];
                return prev.filter((c) => c.id !== ids[1]);
              });
              setSelectedIds(new Set());
              setMergeOpen(false);
            }}
          />
        );
      })()}

      {/* Create sheet (unchanged) */}
      <CreateContactSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={handleCreated}
      />

      {/* Edit sheet (unchanged) */}
      {editContact && (
        <EditContactSheet
          contact={editContact}
          open={!!editContact}
          onOpenChange={(open) => { if (!open) setEditContact(null); }}
          onSaved={handleEditSaved}
        />
      )}

      {/* Delete dialog (unchanged) */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
      >
        <DialogContent showCloseButton={false} className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("deleteContact")}</DialogTitle>
            <DialogDescription>{t("confirmDeleteContact")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <GunimiButton variant="secondary" disabled={isDeleting} onClick={() => setDeleteTarget(null)}>
              {tc("cancel")}
            </GunimiButton>
            <GunimiButton variant="danger" loading={isDeleting} onClick={handleDeleteConfirm}>
              {tc("delete")}
            </GunimiButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
