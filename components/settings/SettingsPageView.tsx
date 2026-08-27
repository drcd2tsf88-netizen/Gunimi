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
import PipelineSection from "./pipeline/PipelineSection";
import AuditLogSection from "./audit/AuditLogSection";
import TagsSection from "./tags/TagsSection";
import TeamsSection from "./teams/TeamsSection";
import BillingSection from "./billing/BillingSection";
import WebhooksSection from "./webhooks/WebhooksSection";
import { type UserProfile } from "@/server/actions/profile/getUserProfile";
import type { WorkspaceDealStage } from "@/types/dealStage";
import type { AuditLogEntry } from "@/server/actions/workspace/getAuditLogs";
import type { WorkspaceTag } from "@/types/tag";
import type { SubscriptionStatus } from "@/server/actions/billing/getSubscription";
import type { WorkspaceWebhook } from "@/server/actions/webhooks/getWebhooks";
import type { WorkspaceTeamWithMembers, WorkspaceTeamMember } from "@/types/team";

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
  dealStages: WorkspaceDealStage[];
  auditLogs: AuditLogEntry[];
  workspaceTags: WorkspaceTag[];
  subscription: SubscriptionStatus;
  billingSuccess?: boolean;
  webhooks: WorkspaceWebhook[];
  teams: WorkspaceTeamWithMembers[];
  unassignedMembers: WorkspaceTeamMember[];
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
  dealStages,
  auditLogs,
  workspaceTags,
  subscription,
  billingSuccess,
  webhooks,
  teams,
  unassignedMembers,
}: Props) {
  const t = useTranslations("settings");
  const [section, setSection] = useState<SettingsSection>(initialSection ?? "workspace");

  return (
    <div className="space-y-6">
      {/* PAGE HEADING */}
      <GunimiHeading badge={t("badge")} title={t("title")} />

      {/* LAYOUT */}
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
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

          {section === "pipeline" && (
            <PipelineSection initialStages={dealStages} />
          )}

          {section === "teams" && (
            <TeamsSection initialTeams={teams} initialUnassigned={unassignedMembers} />
          )}

          {section === "tags" && (
            <TagsSection initialTags={workspaceTags} />
          )}

          {section === "audit_log" && (
            <AuditLogSection logs={auditLogs} />
          )}

          {section === "billing" && (
            <BillingSection subscription={subscription} showSuccess={billingSuccess} />
          )}

          {section === "webhooks" && (
            <WebhooksSection initialWebhooks={webhooks} />
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
