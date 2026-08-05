"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { WorkspaceTeamWithMembers } from "@/types/organization";

export async function getTeams(): Promise<WorkspaceTeamWithMembers[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_teams")
      .select(`
        id, workspace_id, parent_team_id, team_type, name, description, color, created_at,
        memberships:workspace_team_memberships(
          id, team_id, actor_id, role, joined_at, left_at,
          member:workspace_members(
            id, user_id, role,
            profile:profiles(full_name, avatar_url, email)
          )
        )
      `)
      .eq("workspace_id", workspace.id)
      .order("name");

    if (error) {
      logger.error("getTeams error:", error);
      return [];
    }

    return (data ?? []).map((team) => {
      const activeMemberships = (team.memberships ?? [])
        .filter((m) => !m.left_at)
        .map((m) => {
          const rawMember = Array.isArray(m.member) ? m.member[0] : m.member;
          const rawProfile = rawMember
            ? Array.isArray(rawMember.profile) ? rawMember.profile[0] : rawMember.profile
            : null;
          return {
            id: m.id,
            team_id: m.team_id,
            actor_id: m.actor_id,
            role: m.role as "lead" | "member",
            joined_at: m.joined_at,
            left_at: m.left_at,
            member: rawMember
              ? {
                  id: rawMember.id,
                  user_id: rawMember.user_id,
                  role: rawMember.role,
                  profile: rawProfile
                    ? {
                        full_name: rawProfile.full_name ?? null,
                        avatar_url: rawProfile.avatar_url ?? null,
                        email: rawProfile.email ?? null,
                      }
                    : null,
                }
              : { id: "", user_id: "", role: "", profile: null },
          };
        });
      const lead = activeMemberships.find((m) => m.role === "lead") ?? null;
      return {
        ...team,
        memberships: activeMemberships,
        member_count: activeMemberships.length,
        lead,
      };
    });
  } catch {
    return [];
  }
}
