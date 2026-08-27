"use client";

import { useTranslations } from "next-intl";
import type { AuditLogEntry } from "@/server/actions/admin/getAuditLog";

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function ActionBadge({ action }: { action: string }) {
  const parts = action.split(".");
  const verb = parts[1] ?? action;
  const color =
    verb === "suspend" || verb === "revoke" || verb === "deactivate"
      ? "border-red-500/20 bg-red-500/[0.07] text-red-300"
      : verb === "resume" || verb === "create" || verb === "publish"
      ? "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-300"
      : "border-white/[0.08] bg-white/[0.03] text-white/50";

  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] ${color}`}>
      {action}
    </span>
  );
}

export default function AuditLogTable({ entries }: { entries: AuditLogEntry[] }) {
  const t = useTranslations("admin");

  if (entries.length === 0) {
    return <p className="py-8 text-center text-sm text-white/25">{t("auditNoData")}</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.05] bg-white/[0.02]">
            {[t("auditColTime"), t("auditColActor"), t("auditColAction"), t("auditColEntity"), t("auditColWorkspace")].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-[10px] font-normal uppercase tracking-[0.14em] text-zinc-600"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015]"
            >
              <td className="px-4 py-3 text-xs tabular-nums text-white/35">
                {fmtDateTime(entry.createdAt)}
              </td>
              <td className="px-4 py-3">
                <p className="text-xs font-medium text-white/70">{entry.actorName}</p>
                {entry.actorEmail && (
                  <p className="text-[10px] text-white/30">{entry.actorEmail}</p>
                )}
              </td>
              <td className="px-4 py-3">
                <ActionBadge action={entry.action} />
              </td>
              <td className="px-4 py-3">
                {entry.entityType ? (
                  <div>
                    <p className="text-xs text-white/50">{entry.entityType}</p>
                    {entry.entityId && (
                      <p className="max-w-[140px] truncate font-mono text-[10px] text-white/25">
                        {entry.entityId}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="text-white/20">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-xs text-white/40">
                {entry.workspaceName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
