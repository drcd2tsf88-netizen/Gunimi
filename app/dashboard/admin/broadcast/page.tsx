import { getTranslations } from "next-intl/server";
import { Megaphone } from "lucide-react";
import { getAllAnnouncements } from "@/server/actions/admin/platformAnnouncements";
import BroadcastComposer from "@/components/admin/BroadcastComposer";

export default async function AdminBroadcastPage() {
  const [t, announcements] = await Promise.all([
    getTranslations("admin"),
    getAllAnnouncements(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
            <Megaphone size={12} className="text-violet-300" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-300/70">
            {t("navBroadcast")}
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-white/90">{t("broadcastTitle")}</h1>
        <p className="mt-1 text-sm text-white/35">{t("broadcastSubtitle")}</p>
      </div>

      <BroadcastComposer initial={announcements} />
    </div>
  );
}
