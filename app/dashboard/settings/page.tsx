import { getWorkspaceSettings } from "@/server/actions/workspace/getWorkspaceSettings";
import { getWorkspaceMembers } from "@/server/actions/workspace/getWorkspaceMembers";
import { getWorkspaceMembership } from "@/server/actions/workspace/getWorkspaceMembership";
import { getWorkspaceInvites } from "@/server/actions/workspace/getWorkspaceInvites";
import { getUser } from "@/server/actions/auth/getUser";

import SettingsPageView from "@/components/settings/SettingsPageView";

export default async function SettingsPage() {
  const [settings, membership, members, invites, user] = await Promise.all([
    getWorkspaceSettings(),
    getWorkspaceMembership(),
    getWorkspaceMembers(),
    getWorkspaceInvites(),
    getUser(),
  ]);

  if (!settings || !membership || !user) {
    return null;
  }

  return (
    <SettingsPageView
      workspace={settings}
      members={(members as any[]) ?? []}
      invites={invites}
      currentUserId={user.id}
      currentUserRole={membership.membership?.role ?? "member"}
    />
  );
}
