"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  createAnnouncement,
  deactivateAnnouncement,
  type PlatformAnnouncement,
} from "@/server/actions/admin/platformAnnouncements";
import { Info, AlertTriangle, AlertOctagon } from "lucide-react";

type AnnouncementType = "info" | "warning" | "critical";

const TYPE_CONFIG: Record<AnnouncementType, { icon: React.ElementType; color: string; border: string; bg: string }> = {
  info:     { icon: Info,          color: "text-sky-300",    border: "border-sky-500/20",    bg: "bg-sky-500/[0.07]" },
  warning:  { icon: AlertTriangle, color: "text-amber-300",  border: "border-amber-500/20",  bg: "bg-amber-500/[0.07]" },
  critical: { icon: AlertOctagon,  color: "text-red-300",    border: "border-red-500/20",    bg: "bg-red-500/[0.07]" },
};

function AnnouncementRow({
  ann,
  onDeactivated,
}: {
  ann: PlatformAnnouncement;
  onDeactivated: (id: string) => void;
}) {
  const t = useTranslations("admin");
  const [pending, start] = useTransition();
  const cfg = TYPE_CONFIG[ann.type] ?? TYPE_CONFIG.info;
  const TypeIcon = cfg.icon;

  function deactivate() {
    start(async () => {
      await deactivateAnnouncement(ann.id);
      onDeactivated(ann.id);
    });
  }

  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${cfg.border} ${cfg.bg}`}>
      <TypeIcon size={14} className={`mt-0.5 shrink-0 ${cfg.color}`} />
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${cfg.color}`}>{ann.title}</p>
        {ann.body && <p className="mt-0.5 text-xs text-white/40">{ann.body}</p>}
        <p className="mt-1 text-[10px] text-white/25">
          {new Date(ann.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          {ann.expiresAt && ` · expires ${new Date(ann.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${ann.isActive ? "bg-emerald-500/10 text-emerald-300" : "bg-white/[0.05] text-white/25"}`}>
          {ann.isActive ? t("broadcastActive") : t("broadcastInactive")}
        </span>
        {ann.isActive && (
          <button
            onClick={deactivate}
            disabled={pending}
            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40 transition-all hover:bg-white/[0.07] hover:text-white/70 disabled:opacity-50"
          >
            {pending ? t("broadcastDeactivating") : t("broadcastDeactivate")}
          </button>
        )}
      </div>
    </div>
  );
}

export default function BroadcastComposer({
  initial,
}: {
  initial: PlatformAnnouncement[];
}) {
  const t = useTranslations("admin");
  const [announcements, setAnnouncements] = useState(initial);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<AnnouncementType>("info");
  const [expiresAt, setExpiresAt] = useState("");
  const [pending, start] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  function submit() {
    if (!title.trim()) return;
    start(async () => {
      const result = await createAnnouncement(title.trim(), body.trim() || null, type, expiresAt || null);
      if (result.success) {
        setFeedback(t("broadcastSent"));
        setTitle("");
        setBody("");
        setType("info");
        setExpiresAt("");
      } else {
        setFeedback(t("broadcastFailed"));
      }
    });
  }

  function onDeactivated(id: string) {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: false } : a))
    );
  }

  const TYPE_OPTS: { value: AnnouncementType; label: string }[] = [
    { value: "info",     label: t("broadcastTypeInfo") },
    { value: "warning",  label: t("broadcastTypeWarning") },
    { value: "critical", label: t("broadcastTypeCritical") },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6">
        <p className="mb-5 text-sm font-medium text-white/70">{t("broadcastComposeTitle")}</p>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs text-white/40">{t("broadcastTitleLabel")}</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("broadcastTitlePlaceholder")}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white/80 placeholder-white/20 outline-none transition-colors focus:border-white/[0.15]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-white/40">{t("broadcastBodyLabel")}</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t("broadcastBodyPlaceholder")}
              rows={3}
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white/80 placeholder-white/20 outline-none transition-colors focus:border-white/[0.15]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs text-white/40">{t("broadcastTypeLabel")}</label>
              <div className="flex gap-2">
                {TYPE_OPTS.map((opt) => {
                  const cfg = TYPE_CONFIG[opt.value];
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setType(opt.value)}
                      className={`flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                        type === opt.value
                          ? `${cfg.border} ${cfg.bg} ${cfg.color}`
                          : "border-white/[0.06] bg-white/[0.02] text-white/30 hover:border-white/[0.1] hover:text-white/50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-white/40">{t("broadcastExpiryLabel")}</label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white/50 outline-none transition-colors focus:border-white/[0.15] [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {feedback && (
              <span className="text-xs text-white/40">{feedback}</span>
            )}
            <button
              onClick={submit}
              disabled={pending || !title.trim()}
              className="ml-auto rounded-xl border border-violet-500/25 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-300 transition-all hover:bg-violet-500/15 disabled:opacity-40"
            >
              {pending ? t("broadcastSending") : t("broadcastSend")}
            </button>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-600">
          {t("broadcastAllTitle")}
        </p>
        {announcements.length === 0 ? (
          <p className="py-6 text-center text-sm text-white/25">{t("broadcastNone")}</p>
        ) : (
          <div className="space-y-2">
            {announcements.map((ann) => (
              <AnnouncementRow key={ann.id} ann={ann} onDeactivated={onDeactivated} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
