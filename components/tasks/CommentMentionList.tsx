"use client";

export type MentionItem = {
  id: string;
  label: string;
  email?: string | null;
  color?: string;
};

type Props = {
  items: MentionItem[];
  selectedIndex: number;
  command: (item: MentionItem) => void;
};

export default function CommentMentionList({ items, selectedIndex, command }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="z-[200] min-w-[180px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0F1F]/98 py-1.5 shadow-2xl backdrop-blur-2xl">
      {items.map((item, index) => (
        <button
          key={item.id}
          onMouseDown={(e) => { e.preventDefault(); command(item); }}
          className={[
            "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors",
            index === selectedIndex
              ? "bg-violet-500/10 text-white"
              : "text-white/60 hover:bg-white/[0.04] hover:text-white/80",
          ].join(" ")}
        >
          {item.color ? (
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
          ) : (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-[9px] font-semibold text-violet-200">
              {item.label.slice(0, 2).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-xs font-medium">{item.label}</p>
            {item.email && (
              <p className="truncate text-[10px] text-white/35">{item.email}</p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
