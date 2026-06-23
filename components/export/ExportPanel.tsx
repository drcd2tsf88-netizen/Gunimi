"use client";

import { useTranslations } from "next-intl";

function triggerDownload(path: string) {
  const a = document.createElement("a");
  a.href = path;
  a.click();
}

type ExportItem = {
  key: string;
  path: string;
  filename: string;
};

const EXPORTS: ExportItem[] = [
  { key: "exportCompanies", path: "/api/export/companies", filename: "companies.csv" },
  { key: "exportContacts", path: "/api/export/contacts", filename: "contacts.csv" },
  { key: "exportDeals", path: "/api/export/deals", filename: "deals.csv" },
  { key: "exportTasks", path: "/api/export/tasks", filename: "tasks.csv" },
];

export default function ExportPanel() {
  const t = useTranslations("import");

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-white/40">
        {t("exportTitle")}
      </p>
      <p className="mt-1 text-sm text-white/50">{t("exportSubtitle")}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {EXPORTS.map((item) => (
          <button
            key={item.key}
            onClick={() => triggerDownload(item.path)}
            className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-left transition-all hover:border-violet-500/30 hover:bg-violet-500/5"
          >
            <p className="text-xs font-medium text-white">{t(item.key as Parameters<typeof t>[0])}</p>
            <p className="mt-0.5 text-[10px] text-white/30">{item.filename}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
