import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getTeams } from "@/server/actions/organization/getTeams";
import { getWorkspaceMembers } from "@/server/actions/workspace/getWorkspaceMembers";
import OrganizationTeamDetail from "@/components/organization/OrganizationTeamDetail";

export async function generateMetadata() {
  const t = await getTranslations("organization");
  return { title: t("teamDetailTitle") };
}

export default async function OrganizationTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [teams, members] = await Promise.all([
    getTeams(),
    getWorkspaceMembers(),
  ]);

  const team = teams.find((t) => t.id === id);
  if (!team) notFound();

  return <OrganizationTeamDetail team={team} allMembers={members} />;
}
