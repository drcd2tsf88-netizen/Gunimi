import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

export async function generateMetadata() {
  const t = await getTranslations("settings");
  return { title: t("pageTitle") };
}

import { getWorkspaceSettings } from "@/server/actions/workspace/getWorkspaceSettings";
import { getWorkspaceMembers } from "@/server/actions/workspace/getWorkspaceMembers";
import { getWorkspaceMembership } from "@/server/actions/workspace/getWorkspaceMembership";
import { getWorkspaceInvites } from "@/server/actions/workspace/getWorkspaceInvites";
import { getUser } from "@/server/actions/auth/getUser";
import { getUserWorkspaceSummaries } from "@/server/actions/workspace/getUserWorkspaceSummaries";
import { getUserProfile } from "@/server/actions/profile/getUserProfile";

import SettingsPageView from "@/components/settings/SettingsPageView";
import { type SettingsSection } from "@/components/settings/SettingsNav";
import type { MemberRowData } from "@/components/settings/members/MemberRow";
import { getDealStages } from "@/server/actions/deals/getDealStages";
import { getAuditLogs } from "@/server/actions/workspace/getAuditLogs";
import { getTags } from "@/server/actions/tags/getTags";
import { getSubscription } from "@/server/actions/billing/getSubscription";

const VALID_SECTIONS: SettingsSection[] = ["workspace", "members", "preferences", "profile", "pipeline", "tags", "audit_log", "billing", "danger"];

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; success?: string }>;
}) {
  const cookieStore = await cookies();
  const [t, params, settings, membership, members, invites, user, workspaceSummaries, userProfile, dealStages, auditLogs, workspaceTags, subscription] = await Promise.all([
    getTranslations("settings"),
    searchParams,
    getWorkspaceSettings(),
    getWorkspaceMembership(),
    getWorkspaceMembers(),
    getWorkspaceInvites(),
    getUser(),
    getUserWorkspaceSummaries(),
    getUserProfile(),
    getDealStages(),
    getAuditLogs(),
    getTags(),
    getSubscription(),
  ]);

  if (!settings || !membership || !user) {
    return (
      <div className="flex min-h-[480px] flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-600">{t("badge")}</p>
        <h2 className="text-xl font-semibold text-white">{t("errorHeading")}</h2>
        <p className="max-w-sm text-sm text-white/40">{t("errorDescription")}</p>
        <a
          href="/dashboard/settings"
          className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-white/70 transition-colors hover:border-white/20 hover:text-white"
        >
          {t("errorRefresh")}
        </a>
      </div>
    );
  }

  const initialSection = VALID_SECTIONS.includes(params.section as SettingsSection)
    ? (params.section as SettingsSection)
    : undefined;

  const billingSuccess = params.success === "1";

  const hasWorkspacePref = !!settings.preferences?.language;
  const hasCookie = !!cookieStore.get("GUNIMI_LOCALE")?.value;
  const localeSource: "workspace" | "cookie" | "browser" = hasWorkspacePref
    ? "workspace"
    : hasCookie
      ? "cookie"
      : "browser";

  const isDogfoodEligible = ["admin", "team"].includes(
    (userProfile as { platform_role?: string } | null)?.platform_role ?? ""
  );

  return (
    <SettingsPageView
      workspace={settings}
      members={(members as unknown as MemberRowData[]) ?? []}
      invites={invites}
      currentUserId={user.id}
      currentUserRole={membership.membership?.role ?? "member"}
      initialSection={initialSection}
      workspaceSummaries={workspaceSummaries}
      userProfile={userProfile}
      localeSource={localeSource}
      isDogfoodEligible={isDogfoodEligible}
      dealStages={dealStages}
      auditLogs={auditLogs}
      workspaceTags={workspaceTags}
      subscription={subscription}
      billingSuccess={billingSuccess}
    />
  );
}
