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

const VALID_SECTIONS: SettingsSection[] = ["workspace", "members", "preferences", "profile", "danger"];

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const [params, settings, membership, members, invites, user, workspaceSummaries, userProfile] = await Promise.all([
    searchParams,
    getWorkspaceSettings(),
    getWorkspaceMembership(),
    getWorkspaceMembers(),
    getWorkspaceInvites(),
    getUser(),
    getUserWorkspaceSummaries(),
    getUserProfile(),
  ]);

  if (!settings || !membership || !user) {
    return (
      <div className="flex min-h-[480px] flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-600">Workspace Settings</p>
        <h2 className="text-xl font-semibold text-white">Failed to load settings</h2>
        <p className="max-w-sm text-sm text-white/40">
          Could not load workspace data. Please refresh the page. If the issue persists, verify your workspace access.
        </p>
        <a
          href="/dashboard/settings"
          className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-white/70 transition-colors hover:border-white/20 hover:text-white"
        >
          Refresh
        </a>
      </div>
    );
  }

  const initialSection = VALID_SECTIONS.includes(params.section as SettingsSection)
    ? (params.section as SettingsSection)
    : undefined;

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
    />
  );
}
