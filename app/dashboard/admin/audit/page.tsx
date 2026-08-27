import { getTranslations } from "next-intl/server";
import { ScrollText } from "lucide-react";
import { getAuditLog } from "@/server/actions/admin/getAuditLog";
import AuditLogTable from "@/components/admin/AuditLogTable";

export default async function AdminAuditPage() {
  const [t, entries] = await Promise.all([
    getTranslations("admin"),
    getAuditLog(200),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
            <ScrollText size={12} className="text-white/50" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
            {entries.length} {t("auditColAction").toLowerCase()}s
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-white/90">{t("auditTitle")}</h1>
        <p className="mt-1 text-sm text-white/35">{t("auditSubtitle")}</p>
      </div>

      <AuditLogTable entries={entries} />
    </div>
  );
}
