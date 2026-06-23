import { getTranslations } from "next-intl/server";
import ImportWizard from "@/components/import/ImportWizard";
import ExportPanel from "@/components/export/ExportPanel";

export default async function ImportPage() {
  const t = await getTranslations("import");

  return (
    <div className="space-y-8 px-8 py-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-violet-400">
          {t("badge")}
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{t("title")}</h1>
        <p className="mt-2 text-sm text-white/50">{t("subtitle")}</p>
      </div>

      <ExportPanel />
      <ImportWizard />
    </div>
  );
}
