"use client";

import { useTransition, useState } from "react";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  Sparkles,
  TrendingUp,
  User,
  X,
  CheckSquare2,
} from "lucide-react";

import toast from "react-hot-toast";

import GunimiCard from "@/components/ui/GunimiCard";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiStatCard from "@/components/ui/GunimiStatCard";
import GunimiButton from "@/components/ui/GunimiButton";
import EmailConnectionCard from "@/components/email/EmailConnectionCard";
import type { EmailConnection, EmailThread } from "@/types/email";

import { createTask } from "@/server/actions/tasks/createTask";
import { createNote } from "@/server/actions/notes/createNote";

// Module-level time reference — avoids calling Date.now() during render
const PAGE_NOW = new Date();
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

type LinkedContact = {
  id: string;
  name: string;
  email: string | null;
  threadCount: number;
};

type LinkedCompany = {
  id: string;
  name: string;
  threadCount: number;
};

type Props = {
  threads: EmailThread[];
  connections: EmailConnection[];
};

function formatDate(ts: string | null, now: Date): string {
  if (!ts) return "";
  const d = new Date(ts);
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  if (isToday) {
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }

  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (diffDays < 7) return d.toLocaleDateString(undefined, { weekday: "short" });
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatFullDate(ts: string | null): string {
  if (!ts) return "";
  return new Date(ts).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function senderName(thread: EmailThread): string {
  if (thread.contact?.name) return thread.contact.name;
  return thread.participant_emails[0] ?? "Unknown";
}

// ─── Thread Detail Panel ──────────────────────────────────────────────────────

type ThreadDetailPanelProps = {
  thread: EmailThread;
  onClose: () => void;
  t: ReturnType<typeof useTranslations<"email">>;
};

function ThreadDetailPanel({ thread, onClose, t }: ThreadDetailPanelProps) {
  const [creatingTask, startCreateTask] = useTransition();
  const [creatingNote, startCreateNote] = useTransition();

  function handleCreateTask() {
    startCreateTask(async () => {
      const title = `${t("followUpPrefix")}: ${thread.subject ?? t("noSubject")}`;
      const result = await createTask({ title, priority: "medium" });
      if (result) {
        toast.success(t("taskCreated"));
      } else {
        toast.error(t("failedToCreateTask"));
      }
    });
  }

  function handleCreateNote() {
    startCreateNote(async () => {
      const title = `${t("emailNotePrefix")}: ${thread.subject ?? t("noSubject")}`;
      const content = thread.snippet ? `${t("emailPreview")}:\n${thread.snippet}` : undefined;
      const contactId = thread.contact?.id ?? undefined;
      const result = await createNote({ title, content, contactId });
      if (result) {
        toast.success(t("noteCreated"));
      } else {
        toast.error(t("failedToCreateNote"));
      }
    });
  }

  const participants = thread.participant_emails.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative flex h-full w-full max-w-lg flex-col overflow-hidden border-l border-white/10 bg-[#060816]/95 backdrop-blur-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-6 py-5">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">{t("threadDetailTitle")}</p>
            <h2 className="mt-1 truncate text-base font-semibold text-white/90">
              {thread.subject ?? t("noSubject")}
            </h2>
            <p className="mt-1 text-xs text-white/35">{formatFullDate(thread.last_message_at)}</p>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 shrink-0 rounded-xl border border-white/[0.08] p-1.5 text-white/40 transition-colors hover:text-white/70"
          >
            <X size={14} />
          </button>
        </div>

        {/* SCROLL AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* METADATA */}
          <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            {/* Sender */}
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/15">
                <User size={9} className="text-violet-300" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">{t("fromLabel")}</p>
                <p className="mt-0.5 text-sm text-white/80">{senderName(thread)}</p>
              </div>
            </div>

            {/* Participants */}
            {participants.length > 0 && (
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.05]">
                  <Mail size={9} className="text-white/40" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">{t("participants")}</p>
                  <div className="mt-0.5 flex flex-wrap gap-1">
                    {participants.map((email) => (
                      <span
                        key={email}
                        className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/50"
                      >
                        {email}
                      </span>
                    ))}
                    {thread.participant_emails.length > 5 && (
                      <span className="text-[11px] text-white/30">
                        +{thread.participant_emails.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Message count */}
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.05]">
                <MessageSquare size={9} className="text-white/40" />
              </div>
              <p className="text-xs text-white/40">
                {thread.message_count} {thread.message_count === 1 ? t("message") : t("messages")}
              </p>
              {thread.has_unread && (
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300">
                  {t("unread")}
                </span>
              )}
            </div>
          </div>

          {/* EMAIL PREVIEW */}
          {thread.snippet && (
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-zinc-500">{t("latestMessage")}</p>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="text-sm leading-relaxed text-white/60">{thread.snippet}</p>
              </div>
            </div>
          )}

          {/* CRM LINKS */}
          {(thread.contact || thread.company) && (
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-zinc-500">{t("linkedRecords")}</p>
              <div className="space-y-2">
                {thread.contact && (
                  <Link
                    href={`/dashboard/contacts/${thread.contact.id}`}
                    className="flex items-center gap-3 rounded-xl border border-cyan-500/15 bg-cyan-500/[0.06] px-4 py-3 transition-colors hover:border-cyan-500/30"
                  >
                    <User size={13} className="shrink-0 text-cyan-300" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-cyan-200">{thread.contact.name}</p>
                      {thread.contact.email && (
                        <p className="text-[11px] text-white/30">{thread.contact.email}</p>
                      )}
                    </div>
                    <ArrowRight size={11} className="shrink-0 text-white/20" />
                  </Link>
                )}
                {thread.company && (
                  <Link
                    href={`/dashboard/companies/${thread.company.id}`}
                    className="flex items-center gap-3 rounded-xl border border-violet-500/15 bg-violet-500/[0.06] px-4 py-3 transition-colors hover:border-violet-500/30"
                  >
                    <Building2 size={13} className="shrink-0 text-violet-300" />
                    <p className="flex-1 text-sm font-medium text-violet-200">{thread.company.name}</p>
                    <ArrowRight size={11} className="shrink-0 text-white/20" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="border-t border-white/[0.06] px-6 py-4">
          <p className="mb-3 text-[10px] uppercase tracking-[0.15em] text-zinc-500">{t("actionsLabel")}</p>
          <div className="flex flex-wrap gap-2">
            <GunimiButton
              variant="secondary"
              loading={creatingTask}
              onClick={handleCreateTask}
              className="gap-2 text-xs"
            >
              <CheckSquare2 size={13} />
              {t("createTask")}
            </GunimiButton>
            <GunimiButton
              variant="secondary"
              loading={creatingNote}
              onClick={handleCreateNote}
              className="gap-2 text-xs"
            >
              <FileText size={13} />
              {t("createNote")}
            </GunimiButton>
            {thread.contact && (
              <Link href={`/dashboard/contacts/${thread.contact.id}`}>
                <GunimiButton variant="secondary" className="gap-2 text-xs">
                  <User size={13} />
                  {t("viewContact")}
                </GunimiButton>
              </Link>
            )}
            {thread.company && (
              <Link href={`/dashboard/companies/${thread.company.id}`}>
                <GunimiButton variant="secondary" className="gap-2 text-xs">
                  <Building2 size={13} />
                  {t("viewCompany")}
                </GunimiButton>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Thread Row ───────────────────────────────────────────────────────────────

type ThreadRowProps = {
  thread: EmailThread;
  compact?: boolean;
  onClick?: () => void;
};

function ThreadRow({ thread, compact = false, onClick }: ThreadRowProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
      onClick={onClick}
      className={[
        "flex items-start gap-3 transition-colors",
        onClick
          ? "cursor-pointer hover:bg-white/[0.03]"
          : "hover:bg-white/[0.02]",
        compact ? "px-4 py-3" : "px-5 py-4",
      ].join(" ")}
    >
      <div className="mt-1.5 shrink-0">
        <div
          className={[
            "h-1.5 w-1.5 rounded-full",
            thread.has_unread ? "bg-blue-400" : "bg-transparent",
          ].join(" ")}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p
            className={[
              "truncate text-sm",
              thread.has_unread ? "font-semibold text-white" : "font-normal text-white/60",
            ].join(" ")}
          >
            {senderName(thread)}
          </p>
          <span className="shrink-0 text-[10px] text-white/25">
            {formatDate(thread.last_message_at, PAGE_NOW)}
          </span>
        </div>

        <p
          className={[
            "mt-0.5 truncate text-xs",
            thread.has_unread ? "text-white/70" : "text-white/35",
          ].join(" ")}
        >
          {thread.subject ?? "(No subject)"}
        </p>

        {!compact && (thread.contact || thread.company) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {thread.contact && (
              <span
                className="inline-flex items-center gap-1 rounded-md border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[10px] text-blue-300"
                onClick={(e) => e.stopPropagation()}
              >
                <User size={8} />
                {thread.contact.name}
              </span>
            )}
            {thread.company && (
              <span
                className="inline-flex items-center gap-1 rounded-md border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[10px] text-violet-300"
                onClick={(e) => e.stopPropagation()}
              >
                <Building2 size={8} />
                {thread.company.name}
              </span>
            )}
          </div>
        )}
      </div>

      {thread.message_count > 1 && (
        <span className="mt-1 shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] tabular-nums text-white/30">
          {thread.message_count}
        </span>
      )}
    </div>
  );
}

// ─── Widget Shell ─────────────────────────────────────────────────────────────

type WidgetProps = {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle?: string;
  count?: number;
  children: React.ReactNode;
};

function Widget({ icon: Icon, iconColor, iconBg, title, subtitle, count, children }: WidgetProps) {
  return (
    <GunimiCard className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/[0.05] px-5 py-4">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${iconBg}`}>
          <Icon size={14} className={iconColor} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white/90">{title}</p>
          {subtitle && <p className="mt-0.5 truncate text-[11px] text-white/35">{subtitle}</p>}
        </div>
        {count !== undefined && (
          <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-xs tabular-nums text-white/40">
            {count}
          </span>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </GunimiCard>
  );
}

function WidgetEmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
      <Icon size={20} className="text-zinc-600" />
      <p className="text-sm text-white/25">{message}</p>
    </div>
  );
}

// ─── Unread Priority Widget ───────────────────────────────────────────────────

function UnreadPriorityWidget({
  threads,
  onSelectThread,
  t,
}: {
  threads: EmailThread[];
  onSelectThread: (thread: EmailThread) => void;
  t: ReturnType<typeof useTranslations<"email">>;
}) {
  return (
    <Widget
      icon={Mail}
      iconColor="text-blue-300"
      iconBg="border-blue-500/20 bg-blue-500/10"
      title={t("unreadPriority")}
      subtitle={t("unreadPrioritySubtitle")}
      count={threads.length}
    >
      {threads.length === 0 ? (
        <WidgetEmptyState icon={CheckCircle2} message={t("noUnread")} />
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {threads.slice(0, 5).map((thread) => (
            <ThreadRow key={thread.id} thread={thread} compact onClick={() => onSelectThread(thread)} />
          ))}
        </div>
      )}
    </Widget>
  );
}

// ─── Follow-Up Needed Widget ──────────────────────────────────────────────────

function FollowUpWidget({
  threads,
  onSelectThread,
  t,
}: {
  threads: EmailThread[];
  onSelectThread: (thread: EmailThread) => void;
  t: ReturnType<typeof useTranslations<"email">>;
}) {
  return (
    <Widget
      icon={Clock}
      iconColor="text-amber-300"
      iconBg="border-amber-500/20 bg-amber-500/10"
      title={t("followUpNeeded")}
      subtitle={t("followUpSubtitle")}
      count={threads.length}
    >
      {threads.length === 0 ? (
        <WidgetEmptyState icon={CheckCircle2} message={t("noFollowUps")} />
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {threads.map((thread) => (
            <ThreadRow key={thread.id} thread={thread} compact onClick={() => onSelectThread(thread)} />
          ))}
        </div>
      )}
    </Widget>
  );
}

// ─── Recent Threads Widget ────────────────────────────────────────────────────

function RecentThreadsWidget({
  threads,
  onSelectThread,
  t,
}: {
  threads: EmailThread[];
  onSelectThread: (thread: EmailThread) => void;
  t: ReturnType<typeof useTranslations<"email">>;
}) {
  return (
    <Widget
      icon={MessageSquare}
      iconColor="text-violet-300"
      iconBg="border-violet-500/20 bg-violet-500/10"
      title={t("recentThreads")}
      subtitle={t("recentThreadsSubtitle")}
      count={threads.length}
    >
      {threads.length === 0 ? (
        <WidgetEmptyState icon={Mail} message={t("noThreads")} />
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {threads.map((thread) => (
            <ThreadRow key={thread.id} thread={thread} onClick={() => onSelectThread(thread)} />
          ))}
        </div>
      )}
    </Widget>
  );
}

// ─── Linked Contacts Widget ───────────────────────────────────────────────────

function LinkedContactsWidget({
  contacts,
  t,
}: {
  contacts: LinkedContact[];
  t: ReturnType<typeof useTranslations<"email">>;
}) {
  return (
    <Widget
      icon={User}
      iconColor="text-cyan-300"
      iconBg="border-cyan-500/20 bg-cyan-500/10"
      title={t("linkedContacts")}
      subtitle={t("linkedContactsSubtitle")}
      count={contacts.length}
    >
      {contacts.length === 0 ? (
        <WidgetEmptyState icon={User} message={t("noLinkedContacts")} />
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {contacts.slice(0, 8).map((contact) => {
            const initial = contact.name[0]?.toUpperCase() ?? "?";
            return (
              <Link
                key={contact.id}
                href={`/dashboard/contacts/${contact.id}`}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-[11px] font-semibold text-cyan-300">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white/80">{contact.name}</p>
                  {contact.email && (
                    <p className="truncate text-[11px] text-white/30">{contact.email}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="text-xs text-white/25">
                    {contact.threadCount}
                  </span>
                  <ArrowRight size={11} className="text-white/20" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Widget>
  );
}

// ─── Linked Companies Widget ──────────────────────────────────────────────────

function LinkedCompaniesWidget({
  companies,
  t,
}: {
  companies: LinkedCompany[];
  t: ReturnType<typeof useTranslations<"email">>;
}) {
  return (
    <Widget
      icon={Building2}
      iconColor="text-violet-300"
      iconBg="border-violet-500/20 bg-violet-500/10"
      title={t("linkedCompanies")}
      subtitle={t("linkedCompaniesSubtitle")}
      count={companies.length}
    >
      {companies.length === 0 ? (
        <WidgetEmptyState icon={Building2} message={t("noLinkedCompanies")} />
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {companies.slice(0, 8).map((company) => {
            const initial = company.name[0]?.toUpperCase() ?? "?";
            return (
              <Link
                key={company.id}
                href={`/dashboard/companies/${company.id}`}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-[11px] font-semibold text-violet-300">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white/80">{company.name}</p>
                  <p className="mt-0.5 text-[11px] text-white/30">
                    {company.threadCount} {company.threadCount === 1 ? t("thread") : t("threads")}
                  </p>
                </div>
                <ArrowRight size={11} className="text-white/20" />
              </Link>
            );
          })}
        </div>
      )}
    </Widget>
  );
}

// ─── Intelligence Widget ──────────────────────────────────────────────────────

type IntelSignal = {
  icon: React.ElementType;
  color: string;
  text: string;
};

function IntelligenceWidget({
  threads,
  linkedContacts,
  linkedCompanies,
  t,
}: {
  threads: EmailThread[];
  linkedContacts: LinkedContact[];
  linkedCompanies: LinkedCompany[];
  t: ReturnType<typeof useTranslations<"email">>;
}) {
  const total = threads.length;
  const unreadCount = threads.filter((th) => th.has_unread).length;
  const crmLinked = threads.filter((th) => th.contact || th.company).length;
  const crmRate = total > 0 ? Math.round((crmLinked / total) * 100) : 0;
  const unreadRate = total > 0 ? Math.round((unreadCount / total) * 100) : 0;
  const topContact = linkedContacts[0];
  const topCompany = linkedCompanies[0];

  const signals: IntelSignal[] = [];

  if (total === 0) {
    signals.push({ icon: AlertCircle, color: "text-white/30", text: t("intelligenceNoData") });
  } else {
    signals.push({
      icon: unreadRate > 30 ? AlertTriangle : CheckCircle2,
      color: unreadRate > 30 ? "text-amber-300" : "text-emerald-300",
      text: t("intelligenceUnreadRate", { rate: unreadRate }),
    });

    signals.push({
      icon: crmRate >= 50 ? TrendingUp : AlertCircle,
      color: crmRate >= 50 ? "text-violet-300" : "text-amber-300",
      text: t("intelligenceCrmCoverage", { rate: crmRate }),
    });

    if (topContact) {
      signals.push({
        icon: User,
        color: "text-cyan-300",
        text: t("intelligenceTopContact", { name: topContact.name, count: topContact.threadCount }),
      });
    }

    if (topCompany) {
      signals.push({
        icon: Building2,
        color: "text-violet-300",
        text: t("intelligenceTopCompany", { name: topCompany.name, count: topCompany.threadCount }),
      });
    }
  }

  return (
    <Widget
      icon={Sparkles}
      iconColor="text-violet-300"
      iconBg="border-violet-500/20 bg-violet-500/10"
      title={t("emailIntelligence")}
      subtitle={t("emailIntelligenceSubtitle")}
    >
      <div className="space-y-2.5 px-5 py-4">
        {signals.map((s, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <s.icon size={13} className={`mt-0.5 shrink-0 ${s.color}`} />
            <p className="text-xs leading-relaxed text-white/55">{s.text}</p>
          </div>
        ))}
      </div>
    </Widget>
  );
}

// ─── No Connection State ──────────────────────────────────────────────────────

function NoConnectionState({
  connections,
  t,
}: {
  connections: EmailConnection[];
  t: ReturnType<typeof useTranslations<"email">>;
}) {
  return (
    <div className="space-y-8">
      <GunimiHeading
        badge={t("commandCenterBadge")}
        title={t("commandCenterTitle")}
        subtitle={t("commandCenterSubtitle")}
      />

      <GunimiCard className="p-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            <Mail size={26} className="text-zinc-500" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white/80">{t("noConnectionsTitle")}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/35">
              {t("noConnectionsSubtitle")}
            </p>
          </div>
          <a href="/api/email/connect/gmail">
            <GunimiButton variant="primary" className="mt-2">
              {t("connectGmail")}
            </GunimiButton>
          </a>
        </div>
      </GunimiCard>

      <div>
        <p className="mb-4 text-[11px] uppercase tracking-[0.15em] text-zinc-500">
          {t("connectionStatus")}
        </p>
        <EmailConnectionCard connections={connections} />
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function EmailCommandCenter({ threads, connections }: Props) {
  const t = useTranslations("email");
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null);

  const hasConnection = connections.length > 0;

  // Unread threads — sorted by recency (already sorted by the query)
  const unreadThreads = threads.filter((th) => th.has_unread);

  // Follow-up heuristic: read thread, linked to a contact, single message, older than 3 days
  const followUpThreads = threads.filter((th) => {
    if (th.has_unread) return false;
    if (!th.contact) return false;
    if (!th.last_message_at) return false;
    const age = PAGE_NOW.getTime() - new Date(th.last_message_at).getTime();
    return age > THREE_DAYS_MS && th.message_count <= 2;
  });

  // Recent threads — top 10
  const recentThreads = threads.slice(0, 10);

  // Unique contacts, ranked by thread count
  const contactMap = new Map<string, LinkedContact>();
  threads.forEach((th) => {
    if (th.contact) {
      const existing = contactMap.get(th.contact.id);
      if (existing) {
        existing.threadCount++;
      } else {
        contactMap.set(th.contact.id, { ...th.contact, threadCount: 1 });
      }
    }
  });
  const linkedContacts = [...contactMap.values()].sort((a, b) => b.threadCount - a.threadCount);

  // Unique companies, ranked by thread count
  const companyMap = new Map<string, LinkedCompany>();
  threads.forEach((th) => {
    if (th.company) {
      const existing = companyMap.get(th.company.id);
      if (existing) {
        existing.threadCount++;
      } else {
        companyMap.set(th.company.id, { ...th.company, threadCount: 1 });
      }
    }
  });
  const linkedCompanies = [...companyMap.values()].sort((a, b) => b.threadCount - a.threadCount);

  if (!hasConnection) {
    return <NoConnectionState connections={connections} t={t} />;
  }

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <GunimiHeading
            badge={t("commandCenterBadge")}
            title={t("commandCenterTitle")}
            subtitle={t("commandCenterSubtitle")}
          />
          <a href="/api/email/connect/gmail" className="mt-1 shrink-0">
            <GunimiButton variant="secondary" className="gap-2 text-sm">
              <Mail size={14} />
              {t("addEmail")}
            </GunimiButton>
          </a>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <GunimiStatCard title={t("statsTotalThreads")} value={threads.length} icon={MessageSquare} animated />
          <GunimiStatCard title={t("statsUnread")} value={unreadThreads.length} icon={Mail} animated />
          <GunimiStatCard title={t("statsLinkedContacts")} value={linkedContacts.length} icon={User} animated />
          <GunimiStatCard title={t("statsLinkedCompanies")} value={linkedCompanies.length} icon={Building2} animated />
        </div>

        {/* ROW 1: Unread + Follow-Up */}
        <div className="grid gap-6 lg:grid-cols-2">
          <UnreadPriorityWidget threads={unreadThreads} onSelectThread={setSelectedThread} t={t} />
          <FollowUpWidget threads={followUpThreads} onSelectThread={setSelectedThread} t={t} />
        </div>

        {/* ROW 2: Recent Threads (2/3) + Intelligence (1/3) */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentThreadsWidget threads={recentThreads} onSelectThread={setSelectedThread} t={t} />
          </div>
          <IntelligenceWidget
            threads={threads}
            linkedContacts={linkedContacts}
            linkedCompanies={linkedCompanies}
            t={t}
          />
        </div>

        {/* ROW 3: Linked Contacts + Companies */}
        <div className="grid gap-6 lg:grid-cols-2">
          <LinkedContactsWidget contacts={linkedContacts} t={t} />
          <LinkedCompaniesWidget companies={linkedCompanies} t={t} />
        </div>

        {/* CONNECTION MANAGEMENT */}
        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.15em] text-zinc-500">
            {t("connectionStatus")}
          </p>
          <EmailConnectionCard connections={connections} />
        </div>
      </div>

      {/* THREAD DETAIL PANEL */}
      {selectedThread && (
        <ThreadDetailPanel
          thread={selectedThread}
          onClose={() => setSelectedThread(null)}
          t={t}
        />
      )}
    </>
  );
}
