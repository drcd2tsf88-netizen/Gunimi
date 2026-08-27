export const TEAM_COLORS = ["violet", "blue", "emerald", "amber", "rose", "cyan", "orange", "indigo"] as const;
export type TeamColor = (typeof TEAM_COLORS)[number];

export const TEAM_COLOR_CLASSES: Record<TeamColor, { bg: string; text: string; border: string; dot: string }> = {
  violet:  { bg: "bg-violet-500/15",  text: "text-violet-300",  border: "border-violet-500/20",  dot: "bg-violet-500" },
  blue:    { bg: "bg-blue-500/15",    text: "text-blue-300",    border: "border-blue-500/20",    dot: "bg-blue-500" },
  emerald: { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/20", dot: "bg-emerald-500" },
  amber:   { bg: "bg-amber-500/15",   text: "text-amber-300",   border: "border-amber-500/20",   dot: "bg-amber-500" },
  rose:    { bg: "bg-rose-500/15",    text: "text-rose-300",    border: "border-rose-500/20",    dot: "bg-rose-500" },
  cyan:    { bg: "bg-cyan-500/15",    text: "text-cyan-300",    border: "border-cyan-500/20",    dot: "bg-cyan-500" },
  orange:  { bg: "bg-orange-500/15",  text: "text-orange-300",  border: "border-orange-500/20",  dot: "bg-orange-500" },
  indigo:  { bg: "bg-indigo-500/15",  text: "text-indigo-300",  border: "border-indigo-500/20",  dot: "bg-indigo-500" },
};

export type WorkspaceTeam = {
  id: string;
  workspace_id: string;
  name: string;
  color: string;
  created_at: string;
};

export type WorkspaceTeamMember = {
  memberId: string;
  userId: string;
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
};

export type WorkspaceTeamWithMembers = WorkspaceTeam & {
  members: WorkspaceTeamMember[];
};
