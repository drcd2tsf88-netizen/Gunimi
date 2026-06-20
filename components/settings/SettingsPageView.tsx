"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { WorkspaceSettings } from "@/server/actions/workspace/getWorkspaceSettings";
import { WorkspaceInvite } from "@/server/actions/workspace/getWorkspaceInvites";
import { MemberRowData } from "./members/MemberRow";

import SettingsNav, { SettingsSection } from "./SettingsNav";
import WorkspaceSection from "./workspace/WorkspaceSection";
import MembersSection from "./members/MembersSection";
import PreferencesSection from "./preferences/PreferencesSection";
import DangerSection from "./danger/DangerSection";

type Props = {
  workspace: WorkspaceSettings;
  members: MemberRowData[];
  invites: WorkspaceInvite[];
  currentUserId: string;
  currentUserRole: string;
};

export default function SettingsPageView({
  workspace,
  members,
  invites,
  currentUserId,
  currentUserRole,
}: Props) {
  const t = useTranslations("settings");
  const [section, setSection] = useState<SettingsSection>("workspace");

  return (
    <div className="space-y-6">
      {/* PAGE HEADING */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          {t("badge")}
        </p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight">{t("title")}</h1>
      </div>

      {/* MOBILE NAV */}
      <SettingsNav active={section} onChange={setSection} />

      {/* LAYOUT */}
      <div className="flex gap-8">
        {/* DESKTOP NAV */}
        <div className="hidden md:block">
          <SettingsNav active={section} onChange={setSection} />
        </div>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          {section === "workspace" && (
            <WorkspaceSection workspace={workspace} />
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
              preferences={workspace.preferences}
              currentUserRole={currentUserRole}
            />
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
