import { getTranslations } from "next-intl/server";
import ActivityClientPage from "@/components/activity/ActivityClientPage";

export async function generateMetadata() {
  const t = await getTranslations("activity");
  return { title: t("pageTitle") };
}

export default function ActivityPage() {
  return <ActivityClientPage />;
}
