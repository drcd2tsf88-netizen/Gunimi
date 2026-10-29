"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  Building2,
  ExternalLink,
  Loader2,
  MessageCircle,
  RefreshCw,
  User,
  X,
  CheckSquare2,
  Users,
  Video,
} from "lucide-react";
import toast from "react-hot-toast";

import GunimiCard from "@/components/ui/GunimiCard";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import type { CommunicationThread, CommunicationMessage } from "@/types/communications";
import type { EmailConnection } from "@/types/email";
import { getCommunicationMessages } from "@/server/actions/communications/getCommunicationThreads";
import { createTask } from "@/server/actions/tasks/createTask";

const PAGE_NOW = new Date();

function formatDate(ts: string | null, now: Date, locale: string): string {
  if (!ts) return "";
  const d = new Date(ts);
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (isToday) return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (diffDays < 7) return d.toLocaleDateString(locale, { weekday: "short" });
  return d.toLocaleDateString(locale, { month: "short", day: "numeric" });
}

function formatFullDate(ts: string | null, locale: string): string {
  if (!ts) return "";
  return new Date(ts).toLocaleString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChatTypeIcon({ type }: { type: string | null }) {
  if (type === "group") return <Users size={10} className="text-white/40" />;
  if (type === "meeting") return <Video size={10} className="text-white/40" />;
  return <MessageCircle size={10} className="text-white/40" />;
}

// ─── Thread Row ──────────────────────────────────────────────────────────────

type ThreadRowProps = {
  thread: CommunicationThread;
  selected: boolean;
  onClick: () => void;
  t: ReturnType<typeof useTranslations<"communications">>;
  locale: string;
  now: Date;
};

function ThreadRow({ thread, selected, onClick, t, locale, now }: ThreadRowProps) {
  const displayName =
    thread.display_name ??
    thread.contact?.name ??
    thread.participant_emails[0] ??
    t("noSubject");

  return (
    <button
      onClick={onClick}
      className={`group w-full rounded-xl border p-3 text-left transition-all ${
        selected
          ? "border-violet-500/30 bg-violet-500/[0.07]"
          : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.02]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#5558d6]/20 bg-[#5558d6]/10">
          <ChatTypeIcon type={thread.chat_type} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className={`truncate text-sm font-medium ${thread.has_unread ? "text-white" : "text-white/70"}`}>
              {displayName}
            </p>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="rounded-md border border-[#5558d6]/30 bg-[#5558d6]/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-[#7b7ef4]">
                {thread.channel === "teams" ? t("channelTeams") : t("channelWhatsapp")}
              </span>
              <span className="text-[10px] text-white/25">
                {formatDate(thread.last_message_at, now, locale)}
              </span>
            </div>
          </div>

          {thread.snippet && (
            <p className="mt-0.5 truncate text-xs text-white/35">{thread.snippet}</p>
          )}

          <div className="mt-1.5 flex flex-wrap gap-1">
            {thread.contact && (
              <span className="inline-flex items-center gap-1 rounded-md border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[10px] text-violet-300">
                <User size={8} />
                {thread.contact.name}
              </span>
            )}
            {thread.company && (
              <span className="inline-flex items-center gap-1 rounded-md border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[10px] text-violet-300">
                <Building2 size={8} />
                {thread.company.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Thread Detail Panel ─────────────────────────────────────────────────────

type DetailPanelProps = {
  thread: CommunicationThread;
  onClose: () => void;
  t: ReturnType<typeof useTranslations<"communications">>;
  locale: string;
};

function ThreadDetailPanel({ thread, onClose, t, locale }: DetailPanelProps) {
  const [messages, setMessages] = useState<CommunicationMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [creatingTask, setCreatingTask] = useState(false);

  useEffect(() => {
    setLoadingMessages(true);
    getCommunicationMessages(thread.id)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoadingMessages(false));
  }, [thread.id]);

  const displayName =
    thread.display_name ??
    thread.contact?.name ??
    thread.participant_emails[0] ??
    t("noSubject");

  const teamsDeepLink = `https://teams.microsoft.com/l/chat/${encodeURIComponent(thread.provider_thread_id)}/0`;

  async function handleCreateTask() {
    setCreatingTask(true);
    try {
      const title = `${t("followUpPrefix")}: ${displayName}`;
      const result = await createTask({ title, priority: "medium" });
      if (result) toast.success(t("taskCreated"));
      else toast.error(t("failedToCreateTask"));
    } finally {
      setCreatingTask(false);
    }
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
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-6 py-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">
                {t("threadDetailTitle")}
              </p>
              <span className="rounded-md border border-[#5558d6]/30 bg-[#5558d6]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[#7b7ef4]">
                {thread.channel === "teams" ? t("channelTeams") : t("channelWhatsapp")}
              </span>
            </div>
            <h2 className="mt-1 truncate text-base font-semibold text-white/90">{displayName}</h2>
            <p className="mt-1 text-xs text-white/35">{formatFullDate(thread.last_message_at, locale)}</p>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 shrink-0 rounded-xl border border-white/[0.08] p-1.5 text-white/40 transition-colors hover:text-white/70"
          >
            <X size={14} />
          </button>
        </div>

        {/* Scroll area */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Meta */}
          <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            {thread.contact && (
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/15">
                  <User size={9} className="text-violet-300" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">{t("linkedContact")}</p>
                  <p className="mt-0.5 text-sm text-white/80">{thread.contact.name}</p>
                  {thread.contact.email && (
                    <p className="text-xs text-white/35">{thread.contact.email}</p>
                  )}
                </div>
              </div>
            )}

            {thread.company && (
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/15">
                  <Building2 size={9} className="text-violet-300" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">{t("linkedCompany")}</p>
                  <p className="mt-0.5 text-sm text-white/80">{thread.company.name}</p>
                </div>
              </div>
            )}

            {thread.participant_emails.length > 0 && (
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.05]">
                  <Users size={9} className="text-white/40" />
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
          </div>

          {/* Messages */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">{t("lastMessage")}</p>
            {loadingMessages ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={16} className="animate-spin text-white/30" />
              </div>
            ) : messages.length === 0 ? (
              <p className="py-4 text-center text-xs text-white/30">{t("noMessages")}</p>
            ) : (
              <div className="space-y-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-xl border px-4 py-3 ${
                      msg.is_outbound
                        ? "border-violet-500/20 bg-violet-500/[0.06] ml-8"
                        : "border-white/[0.06] bg-white/[0.02]"
                    }`}
                  >
                    {msg.sender_name && (
                      <p className="mb-1 text-[10px] font-medium text-white/40">{msg.sender_name}</p>
                    )}
                    <p className="text-xs leading-relaxed text-white/70">{msg.body ?? ""}</p>
                    <p className="mt-1.5 text-[10px] text-white/25">
                      {formatFullDate(msg.sent_at, locale)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-white/[0.06] px-6 py-4 space-y-2">
          <a href={teamsDeepLink} target="_blank" rel="noopener noreferrer" className="block">
            <GunimiButton variant="primary" className="w-full gap-2">
              <ExternalLink size={13} />
              {t("openInTeams")}
            </GunimiButton>
          </a>
          <GunimiButton
            variant="secondary"
            className="w-full gap-2"
            loading={creatingTask}
            onClick={handleCreateTask}
          >
            <CheckSquare2 size={13} />
            {t("followUpPrefix")}
          </GunimiButton>
        </div>
      </div>
    </div>
  );
}

// ─── No Connection State ─────────────────────────────────────────────────────

function NoConnectionState({
  hasMs365,
  t,
}: {
  hasMs365: boolean;
  t: ReturnType<typeof useTranslations<"communications">>;
}) {
  return (
    <GunimiCard className="p-12">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#5558d6]/20 bg-[#5558d6]/10">
          <MessageCircle size={24} className="text-[#7b7ef4]" />
        </div>
        <div>
          <p className="text-base font-semibold text-white/80">
            {hasMs365 ? t("needsTeamsScope") : t("noConnectionTitle")}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/35">
            {hasMs365 ? t("needsTeamsScopeDescription") : t("noConnectionDescription")}
          </p>
        </div>
        <a href="/api/communications/connect/teams">
          <GunimiButton variant="primary" className="gap-2">
            <MessageCircle size={14} />
            {hasMs365 ? t("reconnect") : t("connectMs365")}
          </GunimiButton>
        </a>
      </div>
    </GunimiCard>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

type Props = {
  threads: CommunicationThread[];
  connections: EmailConnection[];
};

export default function CommunicationsCenter({ threads, connections }: Props) {
  const t = useTranslations("communications");
  const locale = useLocale();
  const router = useRouter();
  const [selectedThread, setSelectedThread] = useState<CommunicationThread | null>(null);
  const [syncing, setSyncing] = useState(false);
  const didAutoSync = useRef(false);

  const searchParams = useSearchParams();
  const handledRef = useRef(false);

  const ms365Connection = connections.find((c) => c.provider === "microsoft365");
  const hasTeamsScope = ms365Connection?.scope?.includes("Chat.Read") ?? false;
  const hasAnyConnection = !!ms365Connection;

  // Handle ?connected=true after OAuth
  // Use history.replaceState to clean URL without Next.js cache hit, then refresh server data
  useEffect(() => {
    if (handledRef.current) return;
    const connected = searchParams.get("connected");
    if (connected !== "true") return;
    handledRef.current = true;
    toast.success(t("connectSuccess"), { duration: 5000 });
    window.history.replaceState({}, "", "/dashboard/communications");
    router.refresh();
  }, [searchParams, router, t]);

  // Auto-sync on first load if Teams scope exists
  useEffect(() => {
    if (!hasTeamsScope || didAutoSync.current || threads.length > 0) return;
    didAutoSync.current = true;
    fetch("/api/communications/sync", { method: "POST" })
      .then(() => router.refresh())
      .catch(() => {});
  }, [hasTeamsScope, threads.length, router]);

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch("/api/communications/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(t("syncFailed"));
        return;
      }
      toast.success(t("syncComplete", { count: data.synced ?? 0 }));
      router.refresh();
    } catch {
      toast.error(t("syncFailed"));
    } finally {
      setSyncing(false);
    }
  }

  if (!hasAnyConnection || !hasTeamsScope) {
    return (
      <div className="space-y-6">
        <GunimiHeading
          badge={t("commandCenterBadge")}
          title={t("commandCenterTitle")}
          subtitle={t("commandCenterSubtitle")}
        />
        <NoConnectionState hasMs365={hasAnyConnection} t={t} />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <GunimiHeading
            badge={t("commandCenterBadge")}
            title={t("commandCenterTitle")}
            subtitle={t("commandCenterSubtitle")}
          />
          <GunimiButton
            variant="secondary"
            className="shrink-0 gap-1.5 px-3 text-xs h-8"
            disabled={syncing}
            onClick={handleSync}
          >
            {syncing ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <RefreshCw size={12} />
            )}
            {syncing ? t("syncing") : t("sync")}
          </GunimiButton>
        </div>

        {/* Thread list */}
        {threads.length === 0 ? (
          <GunimiEmptyState
            icon={MessageCircle}
            title={t("noMessages")}
            description={t("commandCenterSubtitle")}
          />
        ) : (
          <GunimiCard className="divide-y divide-white/[0.04] p-2">
            <p className="px-2 pb-2 pt-1 text-[10px] uppercase tracking-[0.15em] text-zinc-600">
              {t("recentConversations")}
            </p>
            {threads.map((thread) => (
              <ThreadRow
                key={thread.id}
                thread={thread}
                selected={selectedThread?.id === thread.id}
                onClick={() => setSelectedThread(thread)}
                t={t}
                locale={locale}
                now={PAGE_NOW}
              />
            ))}
          </GunimiCard>
        )}
      </div>

      {selectedThread && (
        <ThreadDetailPanel
          thread={selectedThread}
          onClose={() => setSelectedThread(null)}
          t={t}
          locale={locale}
        />
      )}
    </>
  );
}
