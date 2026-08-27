"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Ban, CheckCircle2 } from "lucide-react";
import { suspendWorkspace } from "@/server/actions/admin/platformActions";
import type { WorkspaceListItem } from "@/server/actions/admin/getWorkspacesList";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function WorkspaceRow({ ws }: { ws: WorkspaceListItem }) {
  const t = useTranslations("admin");
  const [isSuspended, setIsSuspended] = useState(ws.isSuspended);
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const next = !isSuspended;
      await suspendWorkspace(ws.id, next);
      setIsSuspended(next);
    });
  }

  return (
    <tr className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015]">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className={`h-2 w-2 shrink-0 rounded-full ${isSuspended ? "bg-red-500" : "bg-emerald-500"}`} />
          <span className="text-sm text-white/80">{ws.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm tabular-nums text-white/50">
        {ws.memberCount}
      </td>
      <td className="px-4 py-3 text-xs text-white/35">{fmtDate(ws.createdAt)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {ws.aiSuspended && (
            <span className="rounded-full border border-red-500/20 bg-red-500/10 px-1.5 py-0.5 text-[10px] text-red-300">
              AI off
            </span>
          )}
          {isSuspended ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-300">
              <Ban size={9} />
              {t("wsSuspended")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/15 bg-emerald-500/[0.07] px-2 py-0.5 text-[11px] font-medium text-emerald-400">
              <CheckCircle2 size={9} />
              {t("wsActive")}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={toggle}
          disabled={pending}
          className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all disabled:opacity-50 ${
            isSuspended
              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
              : "border border-red-500/20 bg-red-500/[0.07] text-red-300 hover:bg-red-500/15"
          }`}
        >
          {pending ? "..." : isSuspended ? t("wsResume") : t("wsSuspend")}
        </button>
      </td>
    </tr>
  );
}

export default function AdminWorkspacesTable({ workspaces }: { workspaces: WorkspaceListItem[] }) {
  const t = useTranslations("admin");

  if (workspaces.length === 0) {
    return <p className="py-8 text-center text-sm text-white/25">{t("noData")}</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.05] bg-white/[0.02]">
            {[t("wsColName"), t("wsColMembers"), t("wsColCreated"), t("wsColStatus"), t("wsColActions")].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-normal uppercase tracking-[0.14em] text-zinc-600">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {workspaces.map((ws) => (
            <WorkspaceRow key={ws.id} ws={ws} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
