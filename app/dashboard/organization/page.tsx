import { getTranslations } from "next-intl/server";
import { getTeams } from "@/server/actions/organization/getTeams";
import { getWorkspaceMembers } from "@/server/actions/workspace/getWorkspaceMembers";
import OrganizationPageView from "@/components/organization/OrganizationPageView";

export async function generateMetadata() {
  const t = await getTranslations("organization");
  return { title: t("pageTitle") };
}

export default async function OrganizationPage() {
  const [teams, members] = await Promise.all([
    getTeams(),
    getWorkspaceMembers(),
  ]);

  return <OrganizationPageView teams={teams} members={members} />;
}
