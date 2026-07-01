"use client";

import { useState, useTransition } from "react";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Building2,
  FileText,
  Mail,
  MessageSquare,
  User,
  X,
  CheckSquare2,
} from "lucide-react";

import toast from "react-hot-toast";

import OrbitButton from "@/components/ui/OrbitButton";
import type { EmailThread } from "@/types/email";
import { createTask } from "@/server/actions/tasks/createTask";
import { createNote } from "@/server/actions/notes/createNote";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(ts: string | null): string {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (isToday) return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
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
  return thread.participant_emails[0] ?? "";
}

// ─── Thread Detail Panel ──────────────────────────────────────────────────────

type PanelProps = {
  thread: EmailThread;
  onClose: () => void;
};

function ThreadPanel({ thread, onClose }: PanelProps) {
  const t = useTranslations("email");
  const [creatingTask, startCreateTask] = useTransition();
  const [creatingNote, startCreateNote] = useTransition();

  function handleCreateTask() {
    startCreateTask(async () => {
      const title = `${t("followUpPrefix")} ${thread.subject ?? t("noSubject")}`;
      const result = await createTask({ title, priority: "medium" });
      if (result) toast.success(t("taskCreated"));
      else toast.error(t("failedToCreateTask"));
    });
  }

  function handleCreateNote() {
    startCreateNote(async () => {
      const title = `${t("emailNotePrefix")} ${thread.subject ?? t("noSubject")}`;
      const content = thread.snippet ? `${t("emailPreview")}:\n${thread.snippet}` : undefined;
      const contactId = thread.contact?.id ?? undefined;
      const result = await createNote({ title, content, contactId });
      if (result) toast.success(t("noteCreated"));
      else toast.error(t("failedToCreateNote"));
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-lg flex-col overflow-hidden border-l border-white/10 bg-[#060816]/95 backdrop-blur-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-6 py-5">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">
              {t("threadDetailTitle")}
            </p>
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
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* METADATA */}
          <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/15">
                <User size={9} className="text-violet-300" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">{t("fromLabel")}</p>
                <p className="mt-0.5 text-sm text-white/80">{senderName(thread)}</p>
              </div>
            </div>

            {thread.participant_emails.length > 0 && (
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.05]">
                  <Mail size={9} className="text-white/40" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">{t("participants")}</p>
                  <div className="mt-0.5 flex flex-wrap gap-1">
                    {thread.participant_emails.slice(0, 5).map((email) => (
                      <span
                        key={email}
                        className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/50"
                      >
                        {email}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

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

          {thread.snippet && (
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-zinc-500">{t("latestMessage")}</p>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="text-sm leading-relaxed text-white/60">{thread.snippet}</p>
              </div>
            </div>
          )}

          {(thread.contact || thread.company) && (
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-zinc-500">{t("linkedRecords")}</p>
              <div className="space-y-2">
                {thread.contact && (
                  <Link
                    href={`/dashboard/crm/${thread.contact.id}`}
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
            <OrbitButton
              variant="secondary"
              loading={creatingTask}
              onClick={handleCreateTask}
              className="gap-2 text-xs"
            >
              <CheckSquare2 size={13} />
              {t("createTask")}
            </OrbitButton>
            <OrbitButton
              variant="secondary"
              loading={creatingNote}
              onClick={handleCreateNote}
              className="gap-2 text-xs"
            >
              <FileText size={13} />
              {t("createNote")}
            </OrbitButton>
            {thread.contact && (
              <Link href={`/dashboard/crm/${thread.contact.id}`}>
                <OrbitButton variant="secondary" className="gap-2 text-xs">
                  <User size={13} />
                  {t("viewContact")}
                </OrbitButton>
              </Link>
            )}
            {thread.company && (
              <Link href={`/dashboard/companies/${thread.company.id}`}>
                <OrbitButton variant="secondary" className="gap-2 text-xs">
                  <Building2 size={13} />
                  {t("viewCompany")}
                </OrbitButton>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Thread Row ───────────────────────────────────────────────────────────────

type RowProps = {
  thread: EmailThread;
  onClick: () => void;
  showContact?: boolean;
  showCompany?: boolean;
  t: ReturnType<typeof useTranslations<"email">>;
};

function ThreadRow({ thread, onClick, showContact, showCompany, t }: RowProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      className="flex cursor-pointer items-start gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.03]"
    >
      {/* Unread dot */}
      <div className="mt-1.5 shrink-0">
        {thread.has_unread
          ? <div className="h-2 w-2 rounded-full bg-blue-400" />
          : <div className="h-2 w-2 rounded-full bg-white/10" />
        }
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={`truncate text-sm ${thread.has_unread ? "font-semibold text-white/90" : "font-medium text-white/70"}`}>
            {thread.subject ?? t("noSubject")}
          </p>
          <span className="shrink-0 whitespace-nowrap text-[10px] text-white/30">
            {formatDate(thread.last_message_at)}
          </span>
        </div>

        {thread.snippet && (
          <p className="mt-0.5 truncate text-xs text-white/35">{thread.snippet}</p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {showContact && thread.contact && (
            <span className="inline-flex items-center gap-1 rounded-md border border-cyan-500/20 bg-cyan-500/10 px-1.5 py-0.5 text-[10px] text-cyan-300">
              <User size={8} />
              {thread.contact.name}
            </span>
          )}
          {showCompany && thread.company && (
            <span className="inline-flex items-center gap-1 rounded-md border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[10px] text-violet-300">
              <Building2 size={8} />
              {thread.company.name}
            </span>
          )}
          <span className="text-[10px] text-white/20">
            {thread.message_count} {thread.message_count === 1 ? t("message") : t("messages")}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

type Props = {
  threads: EmailThread[];
  showContact?: boolean;
  showCompany?: boolean;
};

export default function EmailThreadCompactList({ threads, showContact, showCompany }: Props) {
  const t = useTranslations("email");
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null);

  return (
    <>
      <div className="divide-y divide-white/[0.04]">
        {threads.map((thread) => (
          <ThreadRow
            key={thread.id}
            thread={thread}
            onClick={() => setSelectedThread(thread)}
            showContact={showContact}
            showCompany={showCompany}
            t={t}
          />
        ))}
      </div>

      {selectedThread && (
        <ThreadPanel
          thread={selectedThread}
          onClose={() => setSelectedThread(null)}
        />
      )}
    </>
  );
}
