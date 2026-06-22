"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Calendar, CheckCircle2, Loader2, RefreshCw, Trash2, Unplug } from "lucide-react";

import OrbitCard from "@/components/ui/OrbitCard";
import OrbitButton from "@/components/ui/OrbitButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { disconnectCalendar } from "@/server/actions/calendar/disconnectCalendar";
import type { CalendarConnection } from "@/types/calendar";

type Props = {
  connections: CalendarConnection[];
};

function formatLastSynced(ts: string | null): string {
  if (!ts) return "Never";
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CalendarConnectionCard({ connections }: Props) {
  const t = useTranslations("calendar");
  const tc = useTranslations("common");
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [disconnectTarget, setDisconnectTarget] = useState<CalendarConnection | null>(null);
  const [isDisconnecting, startDisconnect] = useTransition();

  async function handleSync() {
    try {
      setSyncing(true);
      const res = await fetch("/api/calendar/sync", { method: "POST" });
      if (!res.ok) throw new Error("Sync failed");
      const data = await res.json();
      toast.success(t("syncComplete", { count: data.data?.synced ?? 0 }));
      router.refresh();
    } catch {
      toast.error(t("syncFailed"));
    } finally {
      setSyncing(false);
    }
  }

  function handleDisconnectConfirm() {
    if (!disconnectTarget) return;
    startDisconnect(async () => {
      const ok = await disconnectCalendar(disconnectTarget.id);
      if (ok) {
        toast.success(t("disconnected"));
        setDisconnectTarget(null);
        router.refresh();
      } else {
        toast.error(t("disconnectFailed"));
      }
    });
  }

  if (connections.length === 0) {
    return (
      <OrbitCard className="p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            <Calendar size={22} className="text-zinc-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/70">{t("noConnections")}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/30">
              {t("noConnectionsDescription")}
            </p>
          </div>
          <a href="/api/calendar/connect/google">
            <OrbitButton variant="primary" className="mt-2">
              {t("connectGoogle")}
            </OrbitButton>
          </a>
        </div>
      </OrbitCard>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {connections.map((conn) => (
          <OrbitCard key={conn.id} className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {conn.provider === "google" ? "Google Calendar" : "Microsoft Calendar"}
                  </p>
                  {conn.provider_account_email && (
                    <p className="mt-0.5 truncate text-xs text-white/40">
                      {conn.provider_account_email}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-white/25">
                    {t("lastSynced")}: {formatLastSynced(conn.last_synced_at)}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <OrbitButton
                  variant="secondary"
                  className="h-8 gap-1.5 px-3 text-xs"
                  disabled={syncing}
                  onClick={handleSync}
                >
                  {syncing ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <RefreshCw size={12} />
                  )}
                  {syncing ? t("syncing") : t("sync")}
                </OrbitButton>

                <OrbitButton
                  variant="danger"
                  className="h-8 gap-1.5 px-3 text-xs"
                  onClick={() => setDisconnectTarget(conn)}
                >
                  <Unplug size={12} />
                  {t("disconnect")}
                </OrbitButton>
              </div>
            </div>
          </OrbitCard>
        ))}

        {connections.length === 0 && (
          <a href="/api/calendar/connect/google">
            <OrbitButton variant="secondary">
              {t("connectGoogle")}
            </OrbitButton>
          </a>
        )}
      </div>

      <Dialog
        open={!!disconnectTarget}
        onOpenChange={(open) => { if (!open) setDisconnectTarget(null); }}
      >
        <DialogContent showCloseButton={false} className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("disconnectTitle")}</DialogTitle>
            <DialogDescription>{t("disconnectConfirm")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <OrbitButton
              variant="secondary"
              disabled={isDisconnecting}
              onClick={() => setDisconnectTarget(null)}
            >
              {tc("cancel")}
            </OrbitButton>
            <OrbitButton
              variant="danger"
              loading={isDisconnecting}
              onClick={handleDisconnectConfirm}
            >
              <Trash2 size={13} />
              {t("disconnect")}
            </OrbitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
