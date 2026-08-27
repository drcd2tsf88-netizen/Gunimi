"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { adminRevokeInvite } from "@/server/actions/admin/platformActions";
import type { AdminInviteItem } from "@/server/actions/admin/getAllInvites";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function statusColor(status: string) {
  if (status === "pending") return "text-amber-300";
  if (status === "accepted") return "text-emerald-400";
  if (status === "revoked") return "text-red-400";
  return "text-white/30";
}

function InviteRow({ invite }: { invite: AdminInviteItem }) {
  const t = useTranslations("admin");
  const [status, setStatus] = useState(invite.status);
  const [pending, startTransition] = useTransition();

  function revoke() {
    startTransition(async () => {
      await adminRevokeInvite(invite.id);
      setStatus("revoked");
    });
  }

  const isExpired = status === "pending" && new Date(invite.expiresAt) < new Date();

  return (
    <tr className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015]">
      <td className="px-4 py-3 text-sm text-white/70">{invite.workspaceName}</td>
      <td className="px-4 py-3">
        <p className="text-sm text-white/80">{invite.email}</p>
        <p className="text-xs text-white/30">{t("invSentBy")} {invite.invitedByName}</p>
      </td>
      <td className="px-4 py-3 text-xs capitalize text-white/40">{invite.role}</td>
      <td className="px-4 py-3">
        <span className={`text-xs font-medium capitalize ${isExpired ? "text-red-400" : statusColor(status)}`}>
          {isExpired ? t("invExpired") : status}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-white/30">{fmtDate(invite.expiresAt)}</td>
      <td className="px-4 py-3">
        {status === "pending" && !isExpired ? (
          <button
            onClick={revoke}
            disabled={pending}
            className="rounded-lg border border-red-500/20 bg-red-500/[0.07] px-3 py-1.5 text-[11px] font-medium text-red-300 transition-all hover:bg-red-500/15 disabled:opacity-50"
          >
            {pending ? "..." : t("invRevoke")}
          </button>
        ) : (
          <span className="text-xs text-white/15">—</span>
        )}
      </td>
    </tr>
  );
}

export default function AdminInvitesTable({ invites }: { invites: AdminInviteItem[] }) {
  const t = useTranslations("admin");

  if (invites.length === 0) {
    return <p className="py-8 text-center text-sm text-white/25">{t("noData")}</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.05] bg-white/[0.02]">
            {[t("invColWorkspace"), t("invColEmail"), t("invColRole"), t("invColStatus"), t("invColExpires"), t("invColActions")].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-normal uppercase tracking-[0.14em] text-zinc-600">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invites.map((inv) => (
            <InviteRow key={inv.id} invite={inv} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
