import { getTranslations } from "next-intl/server";
import { getDashboardData } from "@/server/actions/dashboard/getDashboardData";
import { getWorkspaceSettings } from "@/server/actions/workspace/getWorkspaceSettings";
import CustomDashboardView from "@/components/dashboard/CustomDashboardView";

export async function generateMetadata() {
  const t = await getTranslations("customDashboard");
  return { title: t("pageTitle") };
}

export default async function CustomDashboardPage() {
  const [data, settings] = await Promise.all([
    getDashboardData(),
    getWorkspaceSettings(),
  ]);

  const savedWidgets = (settings?.preferences?.dashboardWidgets as string[] | undefined) ?? null;

  return (
    <CustomDashboardView
      data={data}
      savedWidgets={savedWidgets}
    />
  );
}
