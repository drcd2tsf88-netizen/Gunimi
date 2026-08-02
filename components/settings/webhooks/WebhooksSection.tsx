"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, FlaskConical, Copy, Check, Webhook, X, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";

import GunimiButton from "@/components/ui/GunimiButton";
import GunimiInput from "@/components/ui/GunimiInput";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import { createWebhook } from "@/server/actions/webhooks/createWebhook";
import { deleteWebhook } from "@/server/actions/webhooks/deleteWebhook";
import { toggleWebhook } from "@/server/actions/webhooks/toggleWebhook";
import { testWebhook } from "@/server/actions/webhooks/testWebhook";
import type { WorkspaceWebhook } from "@/server/actions/webhooks/getWebhooks";

const ALL_EVENTS = [
  "contact.created",
  "deal.created",
  "deal.won",
  "deal.lost",
  "task.created",
] as const;

type WebhookEvent = (typeof ALL_EVENTS)[number];

type Props = { initialWebhooks: WorkspaceWebhook[] };

export default function WebhooksSection({ initialWebhooks }: Props) {
  const t = useTranslations("webhooks");
  const [isPending, startTransition] = useTransition();
  const [hooks, setHooks] = useState<WorkspaceWebhook[]>(initialWebhooks);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>([]);

  function toggleEvent(ev: WebhookEvent) {
    setSelectedEvents((prev) =>
      prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev],
    );
  }

  function handleCreate() {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
      toast.error(t("invalidUrl"));
      return;
    }
    if (selectedEvents.length === 0) {
      toast.error(t("noEvents"));
      return;
    }
    startTransition(async () => {
      const result = await createWebhook(trimmedUrl, selectedEvents as string[]);
      if (result.success && result.webhook) {
        setHooks((prev) => [result.webhook!, ...prev]);
        setUrl("");
        setSelectedEvents([]);
        setShowCreate(false);
        toast.success(t("webhookCreated"));
      } else {
        toast.error(t("createFailed"));
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteWebhook(id);
      if (result.success) {
        setHooks((prev) => prev.filter((h) => h.id !== id));
        setDeleteId(null);
        toast.success(t("webhookDeleted"));
      } else {
        // keep confirm dialog open so user can retry
        toast.error(t("deleteFailed"));
      }
    });
  }

  function handleToggle(hook: WorkspaceWebhook) {
    startTransition(async () => {
      const result = await toggleWebhook(hook.id, !hook.active);
      if (result.success) {
        setHooks((prev) =>
          prev.map((h) => (h.id === hook.id ? { ...h, active: !hook.active } : h)),
        );
        toast.success(t("webhookToggled"));
      } else {
        toast.error(t("toggleFailed"));
      }
    });
  }

  function handleTest(id: string) {
    startTransition(async () => {
      const result = await testWebhook(id);
      if (result.success) {
        toast.success(t("testSuccess"));
      } else {
        toast.error(t("testFailed"));
      }
    });
  }

  function handleCopySecret(hook: WorkspaceWebhook) {
    void navigator.clipboard.writeText(hook.secret);
    setCopiedId(hook.id);
    toast.success(t("secretCopied"));
    setTimeout(() => setCopiedId((prev) => (prev === hook.id ? null : prev)), 2000);
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">{t("title")}</h2>
          <p className="mt-1 text-sm text-white/40">{t("subtitle")}</p>
        </div>
        <GunimiButton
          variant="secondary"
          className="gap-1.5 px-3 py-2 text-xs"
          onClick={() => setShowCreate((p) => !p)}
        >
          <Plus size={13} />
          {t("addWebhook")}
        </GunimiButton>
      </div>

      {/* CREATE FORM */}
      {showCreate && (
        <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          {/* URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/60">{t("urlLabel")}</label>
            <GunimiInput
              type="url"
              value={url}
              autoFocus
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setShowCreate(false);
              }}
              placeholder={t("urlPlaceholder")}
              className="font-mono text-sm"
            />
          </div>

          {/* EVENTS */}
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-white/60">{t("eventsLabel")}</p>
              <p className="mt-0.5 text-xs text-white/30">{t("eventsDescription")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_EVENTS.map((ev) => {
                const active = selectedEvents.includes(ev);
                const labelKey = `event_${ev.replace(".", "_")}_label` as Parameters<typeof t>[0];
                return (
                  <button
                    key={ev}
                    onClick={() => toggleEvent(ev)}
                    aria-pressed={active}
                    className={[
                      "rounded-lg border px-3 py-1.5 font-mono text-xs transition-all",
                      active
                        ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                        : "border-white/[0.08] bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white/60",
                    ].join(" ")}
                  >
                    {t(labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2 pt-1">
            <GunimiButton
              variant="primary"
              className="gap-1.5 px-3 py-2 text-xs"
              loading={isPending}
              disabled={!url.trim() || selectedEvents.length === 0}
              onClick={handleCreate}
            >
              <Check size={12} />
              {t("save")}
            </GunimiButton>
            <GunimiButton
              variant="secondary"
              className="gap-1.5 px-3 py-2 text-xs"
              onClick={() => setShowCreate(false)}
            >
              <X size={12} />
              {t("cancel")}
            </GunimiButton>
          </div>
        </div>
      )}

      {/* WEBHOOK LIST */}
      {hooks.length === 0 ? (
        <GunimiEmptyState
          icon={Webhook}
          title={t("noWebhooks")}
          description={t("noWebhooksDescription")}
        />
      ) : (
        <div className="space-y-3">
          {hooks.map((hook) => (
            <div
              key={hook.id}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              {deleteId === hook.id ? (
                /* DELETE CONFIRM */
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-white/60">{t("confirmDelete")}</p>
                  <p className="text-xs text-white/30">{t("confirmDeleteDescription")}</p>
                  <div className="flex gap-2">
                    <GunimiButton
                      variant="danger"
                      className="px-3 py-1.5 text-xs"
                      loading={isPending}
                      onClick={() => handleDelete(hook.id)}
                    >
                      {t("deleteWebhook")}
                    </GunimiButton>
                    <GunimiButton
                      variant="secondary"
                      className="px-3 py-1.5 text-xs"
                      disabled={isPending}
                      onClick={() => setDeleteId(null)}
                    >
                      {t("cancel")}
                    </GunimiButton>
                  </div>
                </div>
              ) : (
                /* NORMAL ROW */
                <div className="space-y-3">
                  {/* URL + STATUS */}
                  <div className="flex items-center gap-3">
                    <p className="min-w-0 flex-1 truncate font-mono text-sm text-white/80">
                      {hook.url}
                    </p>
                    <span
                      className={[
                        "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                        hook.active
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-white/[0.04] text-white/30",
                      ].join(" ")}
                    >
                      {hook.active ? t("active") : t("inactive")}
                    </span>
                  </div>

                  {/* EVENTS */}
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(hook.events) ? hook.events : []).map((ev) => (
                      <span
                        key={ev}
                        className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-white/40"
                      >
                        {ev}
                      </span>
                    ))}
                  </div>

                  {/* SECRET */}
                  <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                    <p className="min-w-0 flex-1 truncate font-mono text-xs text-white/30">
                      {hook.secret}
                    </p>
                    <button
                      onClick={() => handleCopySecret(hook)}
                      aria-label={t("secretLabel")}
                      className="shrink-0 rounded-lg p-1 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/70"
                    >
                      {copiedId === hook.id
                        ? <Check size={12} className="text-emerald-400" />
                        : <Copy size={12} aria-hidden="true" />}
                    </button>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-2 border-t border-white/[0.04] pt-2">
                    <p className="flex-1 text-xs text-white/25">
                      {t("createdOn")} {new Date(hook.created_at).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleTest(hook.id)}
                      disabled={isPending || !hook.active}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70 disabled:opacity-30"
                    >
                      <FlaskConical size={12} aria-hidden="true" />
                      {t("testWebhook")}
                    </button>
                    <button
                      onClick={() => handleToggle(hook)}
                      disabled={isPending}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70 disabled:opacity-30"
                    >
                      {hook.active
                        ? <ToggleRight size={14} className="text-emerald-400" aria-hidden="true" />
                        : <ToggleLeft size={14} aria-hidden="true" />}
                      {hook.active ? t("active") : t("inactive")}
                    </button>
                    <button
                      onClick={() => setDeleteId(hook.id)}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/40 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                    >
                      <Trash2 size={12} aria-hidden="true" />
                      {t("deleteWebhook")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
