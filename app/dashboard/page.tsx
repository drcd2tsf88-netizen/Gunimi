import { getTranslations } from "next-intl/server";
import { getUser } from "@/lib/server/auth";
import { createClient } from "@/lib/supabase/server";
import { getTodayData } from "@/server/actions/today/getTodayData";
import TodayView from "@/components/today/TodayView";

export async function generateMetadata() {
  const t = await getTranslations("today");
  return { title: t("pageTitle") };
}

export default async function TodayPage() {
  const user = await getUser();

  const profilePromise = user
    ? createClient().then((s) =>
        s.from("profiles").select("full_name").eq("id", user.id).maybeSingle()
      )
    : Promise.resolve({ data: null });

  const [{ deals, contacts, tasks }, profileResult] = await Promise.all([
    getTodayData(),
    profilePromise,
  ]);

  const displayName =
    (profileResult.data as { full_name?: string } | null)?.full_name ||
    user?.email?.split("@")[0] ||
    "—";

  return (
    <TodayView
      displayName={displayName}
      deals={deals}
      contacts={contacts}
      tasks={tasks}
    />
  );
}
