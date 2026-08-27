import { getTranslations } from "next-intl/server";
import { Mail } from "lucide-react";
import { getAllInvites } from "@/server/actions/admin/getAllInvites";
import AdminInvitesTable from "@/components/admin/AdminInvitesTable";

export default async function AdminInvitesPage() {
  const [t, invites] = await Promise.all([
    getTranslations("admin"),
    getAllInvites(),
  ]);

  const pending = invites.filter((i) => i.status === "pending" && new Date(i.expiresAt) > new Date());

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10">
            <Mail size={12} className="text-pink-300" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-pink-300/70">
            {pending.length} {t("invPendingCount")} · {invites.length} {t("invTotalCount")}
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-white/90">{t("invitesTitle")}</h1>
        <p className="mt-1 text-sm text-white/35">{t("invitesSubtitle")}</p>
      </div>

      <AdminInvitesTable invites={invites} />
    </div>
  );
}
