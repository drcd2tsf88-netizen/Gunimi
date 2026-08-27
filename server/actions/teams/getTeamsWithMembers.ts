"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { WorkspaceTeamWithMembers } from "@/types/team";

export async function getTeamsWithMembers(): Promise<WorkspaceTeamWithMembers[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const { data: teams, error: teamsError } = await supabase
      .from("workspace_teams")
      .select("id, workspace_id, name, color, created_at")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: true });

    if (teamsError || !teams) {
      logger.error("getTeamsWithMembers teams error:", teamsError);
      return [];
    }

    const { data: members, error: membersError } = await supabase
      .from("workspace_members")
      .select(`
        id,
        user_id,
        team_id,
        profiles (
          full_name,
          email,
          avatar_url
        )
      `)
      .eq("workspace_id", workspace.id);

    if (membersError) {
      logger.error("getTeamsWithMembers members error:", membersError);
      return teams.map((t) => ({ ...t, members: [] }));
    }

    return teams.map((team) => ({
      ...team,
      members: (members ?? [])
        .filter((m) => m.team_id === team.id)
        .map((m) => {
          const p = m.profiles as { full_name?: string | null; email?: string | null; avatar_url?: string | null } | null;
          return {
            memberId: m.id,
            userId: m.user_id,
            fullName: p?.full_name ?? null,
            email: p?.email ?? "",
            avatarUrl: p?.avatar_url ?? null,
          };
        }),
    }));
  } catch (error) {
    logger.error("getTeamsWithMembers failed:", error);
    return [];
  }
}

export type TeamsWithMembersData = {
  teams: WorkspaceTeamWithMembers[];
  unassignedMembers: { memberId: string; userId: string; fullName: string | null; email: string; avatarUrl: string | null }[];
};

export async function getTeamsPageData(): Promise<TeamsWithMembersData> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return { teams: [], unassignedMembers: [] };

    const supabase = await createClient();

    const [teamsRes, membersRes] = await Promise.all([
      supabase
        .from("workspace_teams")
        .select("id, workspace_id, name, color, created_at")
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: true }),
      supabase
        .from("workspace_members")
        .select(`id, user_id, team_id, profiles(full_name, email, avatar_url)`)
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: true }),
    ]);

    if (teamsRes.error) logger.error("getTeamsPageData teams:", teamsRes.error);
    if (membersRes.error) logger.error("getTeamsPageData members:", membersRes.error);

    const teams = teamsRes.data ?? [];
    const members = membersRes.data ?? [];

    const normalise = (m: (typeof members)[number]) => {
      const p = m.profiles as { full_name?: string | null; email?: string | null; avatar_url?: string | null } | null;
      return {
        memberId: m.id,
        userId: m.user_id,
        fullName: p?.full_name ?? null,
        email: p?.email ?? "",
        avatarUrl: p?.avatar_url ?? null,
      };
    };

    return {
      teams: teams.map((team) => ({
        ...team,
        members: members.filter((m) => m.team_id === team.id).map(normalise),
      })),
      unassignedMembers: members.filter((m) => !m.team_id).map(normalise),
    };
  } catch (error) {
    logger.error("getTeamsPageData failed:", error);
    return { teams: [], unassignedMembers: [] };
  }
}
