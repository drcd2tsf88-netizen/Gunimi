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

  const normalizedMembers = (members as Array<{
    id: string;
    user_id: string;
    role: string;
    profiles: Array<{ full_name: string | null; avatar_url: string | null; email: string | null }> | null;
  }>).map((m) => ({
    id: m.id,
    user_id: m.user_id,
    role: m.role,
    profile: Array.isArray(m.profiles) ? (m.profiles[0] ?? null) : (m.profiles ?? null),
  }));

  return <OrganizationPageView teams={teams} members={normalizedMembers} />;
}
