"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import GunimiHeading from "@/components/ui/GunimiHeading";

import { WorkspaceSettings } from "@/server/actions/workspace/getWorkspaceSettings";
import { WorkspaceInvite } from "@/server/actions/workspace/getWorkspaceInvites";
import { MemberRowData } from "./members/MemberRow";
import { WorkspaceSummary } from "@/server/actions/workspace/getUserWorkspaceSummaries";

import SettingsNav, { SettingsSection } from "./SettingsNav";
import WorkspaceSection from "./workspace/WorkspaceSection";
import MembersSection from "./members/MembersSection";
import PreferencesSection from "./preferences/PreferencesSection";
import ProfileSection from "./profile/ProfileSection";
import DangerSection from "./danger/DangerSection";
import { type UserProfile } from "@/server/actions/profile/getUserProfile";

type Props = {
  workspace: WorkspaceSettings;
  members: MemberRowData[];
  invites: WorkspaceInvite[];
  currentUserId: string;
  currentUserRole: string;
  initialSection?: SettingsSection;
  workspaceSummaries: WorkspaceSummary[];
  userProfile: UserProfile | null;
  localeSource: "workspace" | "cookie" | "browser";
  isDogfoodEligible: boolean;
};

export default function SettingsPageView({
  workspace,
  members,
  invites,
  currentUserId,
  currentUserRole,
  initialSection,
  workspaceSummaries,
  userProfile,
  localeSource,
  isDogfoodEligible,
}: Props) {
  const t = useTranslations("settings");
  const [section, setSection] = useState<SettingsSection>(initialSection ?? "workspace");

  return (
    <div className="space-y-6">
      {/* PAGE HEADING */}
      <GunimiHeading badge={t("badge")} title={t("title")} />

      {/* LAYOUT */}
      <div className="flex gap-8">
        <SettingsNav active={section} onChange={setSection} />

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          {section === "workspace" && (
            <WorkspaceSection
              key={workspace.id}
              workspace={workspace}
              workspaceSummaries={workspaceSummaries}
            />
          )}

          {section === "members" && (
            <MembersSection
              members={members}
              invites={invites}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
            />
          )}

          {section === "preferences" && (
            <PreferencesSection
              key={workspace.id}
              preferences={workspace.preferences ?? null}
              currentUserRole={currentUserRole}
              localeSource={localeSource}
              isDogfoodEligible={isDogfoodEligible}
            />
          )}

          {section === "profile" && userProfile && (
            <ProfileSection profile={userProfile} />
          )}

          {section === "danger" && (
            <DangerSection
              currentUserRole={currentUserRole}
              workspaceName={workspace.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}
