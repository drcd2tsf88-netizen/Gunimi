export type TeamType = "team" | "department" | "division" | "business_unit" | "region";

export type TeamRole = "lead" | "member";

export type ActorType = "person" | "team" | "agent" | "system" | "organization";

export type Responsibility = "owner" | "collaborator" | "reviewer" | "approver" | "observer";

export type AssignmentStatus =
  | "proposed"
  | "accepted"
  | "active"
  | "waiting"
  | "blocked"
  | "completed"
  | "cancelled";

export type WorkspaceTeam = {
  id: string;
  workspace_id: string;
  parent_team_id: string | null;
  team_type: TeamType;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
};

export type WorkspaceTeamMembership = {
  id: string;
  team_id: string;
  actor_id: string;
  role: TeamRole;
  joined_at: string;
  left_at: string | null;
};

export type WorkspaceTeamMember = WorkspaceTeamMembership & {
  member: {
    id: string;
    user_id: string;
    role: string;
    profile: {
      full_name: string | null;
      avatar_url: string | null;
      email: string | null;
    } | null;
  };
};

export type WorkspaceTeamWithMembers = WorkspaceTeam & {
  memberships: WorkspaceTeamMember[];
  member_count: number;
  lead: WorkspaceTeamMember | null;
};

export type DecisionContext = {
  stage?: string;
  value?: number;
  risk_level?: string;
  confidence_score?: number;
  ai_recommendation?: string;
  trigger?: string;
  reason?: string;
  expected_outcome?: string;
  escalation_policy?: string;
};

export type WorkspaceAssignment = {
  id: string;
  workspace_id: string;
  entity_type: string;
  entity_id: string;
  actor_type: ActorType;
  actor_id: string;
  responsibility: Responsibility;
  decision_context: DecisionContext | null;
  status: AssignmentStatus;
  created_at: string;
  active_from: string | null;
  active_until: string | null;
  created_by_actor_type: ActorType | null;
  created_by_actor_id: string | null;
  closed_reason: string | null;
  transferred_to: string | null;
};

export type WorkspaceAssignmentWithActor = WorkspaceAssignment & {
  team?: WorkspaceTeam | null;
  memberProfile?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};
