import { getTranslations } from "next-intl/server";
import { Users } from "lucide-react";
import { getUsersList } from "@/server/actions/admin/getUsersList";
import AdminUsersTable from "@/components/admin/AdminUsersTable";

export default async function AdminUsersPage() {
  const [t, users] = await Promise.all([
    getTranslations("admin"),
    getUsersList(),
  ]);

  const adminCount = users.filter((u) => u.platformRole === "admin").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
              <Users size={12} className="text-violet-300" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-300/70">
              {users.length} {t("usersTotal")} · {adminCount} {t("usersAdminCount")}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white/90">{t("usersTitle")}</h1>
          <p className="mt-1 text-sm text-white/35">{t("usersSubtitle")}</p>
        </div>
      </div>

      <AdminUsersTable users={users} />
    </div>
  );
}
