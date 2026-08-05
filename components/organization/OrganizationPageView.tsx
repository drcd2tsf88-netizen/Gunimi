"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, UsersRound, ChevronRight } from "lucide-react";

import GunimiSection from "@/components/layout/GunimiSection";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiCard from "@/components/ui/GunimiCard";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import TeamSheet from "@/components/organization/TeamSheet";

import type { WorkspaceTeamWithMembers, WorkspaceTeam } from "@/types/organization";

type Props = {
  teams: WorkspaceTeamWithMembers[];
  members: unknown[];
};

export default function OrganizationPageView({ teams: initialTeams }: Props) {
  const t = useTranslations("organization");
  const router = useRouter();

  const [teams, setTeams] = useState(initialTeams);
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleTeamCreated(team: WorkspaceTeam) {
    setTeams((prev) => [
      ...prev,
      { ...team, memberships: [], member_count: 0, lead: null },
    ]);
    router.refresh();
  }

  return (
    <GunimiSection>
      <div className="flex items-start justify-between gap-4">
        <GunimiHeading
          badge={t("badge")}
          title={t("heading")}
          subtitle={t("description")}
        />
        <GunimiButton
          onClick={() => setSheetOpen(true)}
          className="shrink-0 gap-1.5 px-4 py-2.5 text-[13px]"
        >
          <Plus size={13} />
          {t("createTeam")}
        </GunimiButton>
      </div>

      {teams.length === 0 ? (
        <GunimiEmptyState
          icon={UsersRound}
          title={t("noTeams")}
          description={t("noTeamsDescription")}
          action={
            <GunimiButton onClick={() => setSheetOpen(true)} className="gap-1.5">
              <Plus size={13} />
              {t("createTeam")}
            </GunimiButton>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link key={team.id} href={`/dashboard/organization/${team.id}`}>
              <GunimiCard hoverable className="p-5 transition-all hover:border-white/[0.10]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/90"
                      style={{ backgroundColor: `${team.color}22`, border: `1px solid ${team.color}44` }}
                    >
                      <UsersRound size={16} style={{ color: team.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-[#F7F8FC]">{team.name}</p>
                      {team.description && (
                        <p className="mt-0.5 truncate text-[11px] text-white/35">{team.description}</p>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={14} className="mt-0.5 shrink-0 text-white/20" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Member avatars */}
                    <div className="flex -space-x-1.5">
                      {team.memberships.slice(0, 4).map((m) => (
                        <div
                          key={m.id}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-[#0A0E17] bg-[#6D5BFF]/20 text-[9px] font-semibold text-[#8B7DFF]"
                        >
                          {(m.member?.profile?.full_name?.[0] ?? "?").toUpperCase()}
                        </div>
                      ))}
                      {team.member_count > 4 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#0A0E17] bg-white/[0.05] text-[9px] text-white/40">
                          +{team.member_count - 4}
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-white/30">
                      {team.member_count} {t(team.member_count === 1 ? "memberSingular" : "memberPlural")}
                    </span>
                  </div>

                  {team.lead && (
                    <span className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                      style={{ backgroundColor: `${team.color}18`, color: team.color }}
                    >
                      {team.lead.member?.profile?.full_name?.split(" ")[0] ?? t("roleLead")}
                    </span>
                  )}
                </div>
              </GunimiCard>
            </Link>
          ))}
        </div>
      )}

      <TeamSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={handleTeamCreated}
      />
    </GunimiSection>
  );
}
