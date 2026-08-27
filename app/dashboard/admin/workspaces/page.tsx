import { getTranslations } from "next-intl/server";
import { Building2 } from "lucide-react";
import { getWorkspacesList } from "@/server/actions/admin/getWorkspacesList";
import AdminWorkspacesTable from "@/components/admin/AdminWorkspacesTable";

export default async function AdminWorkspacesPage() {
  const [t, workspaces] = await Promise.all([
    getTranslations("admin"),
    getWorkspacesList(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
              <Building2 size={12} className="text-blue-300" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-300/70">
              {workspaces.length} {t("wsTotal")}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white/90">{t("workspacesTitle")}</h1>
          <p className="mt-1 text-sm text-white/35">{t("workspacesSubtitle")}</p>
        </div>
      </div>

      <AdminWorkspacesTable workspaces={workspaces} />
    </div>
  );
}
