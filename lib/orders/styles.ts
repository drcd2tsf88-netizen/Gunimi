export const ORDER_STATUS_STYLES: Record<string, string> = {
  draft:       "border-zinc-700 bg-zinc-800/60 text-zinc-400",
  confirmed:   "border-blue-500/20 bg-blue-500/10 text-blue-300",
  in_progress: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  completed:   "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  cancelled:   "border-red-500/20 bg-red-500/10 text-red-400",
};

export const ORDER_COMM_STYLES: Record<string, string> = {
  not_sent:     "text-zinc-500",
  sent:         "text-amber-400",
  acknowledged: "text-emerald-400",
};

export const ORDER_COMM_BADGE_STYLES: Record<string, string> = {
  not_sent:     "border-zinc-700 bg-zinc-800/60 text-zinc-500",
  sent:         "border-amber-500/20 bg-amber-500/10 text-amber-300",
  acknowledged: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
};
