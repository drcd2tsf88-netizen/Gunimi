export type WorkspaceTag = {
  id: string;
  workspace_id: string;
  name: string;
  color: string;
  created_at: string;
};

export type EntityType = "contact" | "company" | "deal" | "task" | "note";

export const TAG_COLORS = [
  "violet",
  "cyan",
  "blue",
  "amber",
  "emerald",
  "zinc",
  "rose",
  "teal",
  "orange",
  "pink",
] as const;

export type TagColor = (typeof TAG_COLORS)[number];

export const TAG_COLOR_CLASSES: Record<string, { bg: string; text: string; border: string }> = {
  violet:  { bg: "bg-violet-500/10",  text: "text-violet-300",  border: "border-violet-500/20" },
  cyan:    { bg: "bg-cyan-500/10",    text: "text-cyan-300",    border: "border-cyan-500/20" },
  blue:    { bg: "bg-blue-500/10",    text: "text-blue-300",    border: "border-blue-500/20" },
  amber:   { bg: "bg-amber-500/10",   text: "text-amber-300",   border: "border-amber-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500/20" },
  zinc:    { bg: "bg-zinc-500/10",    text: "text-zinc-300",    border: "border-zinc-500/20" },
  rose:    { bg: "bg-rose-500/10",    text: "text-rose-300",    border: "border-rose-500/20" },
  teal:    { bg: "bg-teal-500/10",    text: "text-teal-300",    border: "border-teal-500/20" },
  orange:  { bg: "bg-orange-500/10",  text: "text-orange-300",  border: "border-orange-500/20" },
  pink:    { bg: "bg-pink-500/10",    text: "text-pink-300",    border: "border-pink-500/20" },
};
