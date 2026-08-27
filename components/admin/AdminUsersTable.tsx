"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Shield, User } from "lucide-react";
import { setUserPlatformRole } from "@/server/actions/admin/platformActions";
import type { UserListItem } from "@/server/actions/admin/getUsersList";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function UserRow({ user, currentAdminId }: { user: UserListItem; currentAdminId?: string }) {
  const t = useTranslations("admin");
  const [role, setRole] = useState(user.platformRole);
  const [pending, startTransition] = useTransition();
  const isMe = user.id === currentAdminId;

  function toggleAdmin() {
    if (isMe) return;
    const next = role === "admin" ? null : "admin";
    startTransition(async () => {
      await setUserPlatformRole(user.id, next);
      setRole(next);
    });
  }

  return (
    <tr className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015]">
      <td className="px-4 py-3">
        <p className="text-sm text-white/80">{user.fullName ?? "—"}</p>
        <p className="text-xs text-white/30">{user.email}</p>
      </td>
      <td className="px-4 py-3">
        {role === "admin" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-300">
            <Shield size={9} />
            {t("userAdmin")}
          </span>
        ) : role === "team" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/15 bg-blue-500/[0.07] px-2 py-0.5 text-[11px] font-medium text-blue-300">
            <User size={9} />
            {t("userTeam")}
          </span>
        ) : (
          <span className="text-xs text-white/25">{t("userMember")}</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm tabular-nums text-white/50">{user.workspaceCount}</td>
      <td className="px-4 py-3 text-xs text-white/35">{fmtDate(user.createdAt)}</td>
      <td className="px-4 py-3">
        {isMe ? (
          <span className="text-xs text-white/20">{t("userYou")}</span>
        ) : (
          <button
            onClick={toggleAdmin}
            disabled={pending}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all disabled:opacity-50 ${
              role === "admin"
                ? "border border-white/[0.08] bg-white/[0.03] text-white/40 hover:bg-white/[0.06]"
                : "border border-red-500/20 bg-red-500/[0.07] text-red-300 hover:bg-red-500/15"
            }`}
          >
            {pending ? "..." : role === "admin" ? t("userRemoveAdmin") : t("userMakeAdmin")}
          </button>
        )}
      </td>
    </tr>
  );
}

export default function AdminUsersTable({ users }: { users: UserListItem[] }) {
  const t = useTranslations("admin");

  if (users.length === 0) {
    return <p className="py-8 text-center text-sm text-white/25">{t("noData")}</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.05] bg-white/[0.02]">
            {[t("userColName"), t("userColRole"), t("userColWorkspaces"), t("userColJoined"), t("userColActions")].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-normal uppercase tracking-[0.14em] text-zinc-600">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
