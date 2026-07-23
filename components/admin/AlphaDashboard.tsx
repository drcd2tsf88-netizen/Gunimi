"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2, Users } from "lucide-react";
import { approveUser } from "@/server/actions/alpha/approveUser";
import toast from "react-hot-toast";

type PendingUser = {
  id: string;
  full_name: string | null;
  email: string;
  created_at: string;
};

type Props = {
  pending: PendingUser[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ApproveButton({ userId }: { userId: string }) {
  const t = useTranslations("admin.alpha");
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function handleApprove() {
    startTransition(async () => {
      const result = await approveUser(userId);
      if (result.success) {
        setDone(true);
        toast.success(t("approveSuccess"));
      } else {
        toast.error(t("approveError"));
      }
    });
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22c55e]/10 px-3 py-1 text-[12px] font-medium text-[#22c55e]">
        <CheckCircle2 size={12} />
        {t("approved")}
      </span>
    );
  }

  return (
    <button
      onClick={handleApprove}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#6D5BFF]/30 bg-[#6D5BFF]/10 px-3 py-1.5 text-[12px] font-medium text-[#8B7DFF] transition-colors hover:bg-[#6D5BFF]/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? (
        <>
          <Loader2 size={12} className="animate-spin" />
          {t("approving")}
        </>
      ) : (
        t("approve")
      )}
    </button>
  );
}

export default function AlphaDashboard({ pending }: Props) {
  const t = useTranslations("admin.alpha");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">
            {t("pageTitle")}
          </h1>
          <p className="mt-1 text-[14px] text-[#9AA3B2]">{t("pageSubtitle")}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#6D5BFF]/20 bg-[#6D5BFF]/[0.08] px-3 py-1.5">
          <Users size={13} className="text-[#8B7DFF]" />
          <span className="text-[13px] font-medium text-[#8B7DFF]">{pending.length}</span>
        </div>
      </div>

      {/* Table */}
      {pending.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[16px] border border-white/[0.04] bg-white/[0.02] py-16 text-center">
          <CheckCircle2 size={32} className="mb-4 text-[#22c55e]/40" />
          <p className="text-[15px] font-medium text-[#F7F8FC]">{t("emptyTitle")}</p>
          <p className="mt-1 text-[13px] text-[#9AA3B2]">{t("emptySubtitle")}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[16px] border border-white/[0.04]">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 border-b border-white/[0.04] bg-white/[0.02] px-5 py-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#9AA3B2]">{t("colName")}</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#9AA3B2]">{t("colEmail")}</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#9AA3B2]">{t("colRegistered")}</span>
            <span />
          </div>

          {/* Rows */}
          {pending.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-4 border-b border-white/[0.03] px-5 py-4 last:border-0 hover:bg-white/[0.015]"
            >
              <div>
                <p className="text-[14px] font-medium text-[#F7F8FC]">
                  {u.full_name ?? "—"}
                </p>
              </div>
              <p className="truncate text-[13px] text-[#9AA3B2]">{u.email}</p>
              <p className="text-[13px] text-[#9AA3B2]">{formatDate(u.created_at)}</p>
              <ApproveButton userId={u.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
