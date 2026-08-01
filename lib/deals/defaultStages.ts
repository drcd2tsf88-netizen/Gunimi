export const DEFAULT_DEAL_STAGES = [
  { slug: "lead",        name: "Lead",        order_index: 0, color: "violet",  is_won: false, is_lost: false },
  { slug: "qualified",   name: "Qualified",   order_index: 1, color: "cyan",    is_won: false, is_lost: false },
  { slug: "proposal",    name: "Proposal",    order_index: 2, color: "blue",    is_won: false, is_lost: false },
  { slug: "negotiation", name: "Negotiation", order_index: 3, color: "amber",   is_won: false, is_lost: false },
  { slug: "won",         name: "Won",         order_index: 4, color: "emerald", is_won: true,  is_lost: false },
  { slug: "lost",        name: "Lost",        order_index: 5, color: "zinc",    is_won: false, is_lost: true  },
] as const;

export const STAGE_COLORS = ["violet", "cyan", "blue", "amber", "emerald", "zinc", "rose", "teal"] as const;
export type StageColor = (typeof STAGE_COLORS)[number];

export const STAGE_DOT_CLASS: Record<string, string> = {
  violet:  "bg-violet-400",
  cyan:    "bg-cyan-400",
  blue:    "bg-blue-400",
  amber:   "bg-amber-400",
  emerald: "bg-emerald-400",
  zinc:    "bg-zinc-500",
  rose:    "bg-rose-400",
  teal:    "bg-teal-400",
};

export const STAGE_TEXT_CLASS: Record<string, string> = {
  violet:  "text-violet-400",
  cyan:    "text-cyan-400",
  blue:    "text-blue-400",
  amber:   "text-amber-400",
  emerald: "text-emerald-400",
  zinc:    "text-zinc-500",
  rose:    "text-rose-400",
  teal:    "text-teal-400",
};
