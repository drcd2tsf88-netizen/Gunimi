import { X } from "lucide-react";
import { TAG_COLOR_CLASSES } from "@/types/tag";
import type { WorkspaceTag } from "@/types/tag";

type Props = {
  tag: WorkspaceTag;
  onRemove?: () => void;
  size?: "sm" | "xs";
};

export default function TagBadge({ tag, onRemove, size = "sm" }: Props) {
  const colors = TAG_COLOR_CLASSES[tag.color] ?? TAG_COLOR_CLASSES.violet;

  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border font-medium transition-colors",
        size === "xs" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        colors.bg,
        colors.text,
        colors.border,
      ].join(" ")}
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full opacity-60 transition-opacity hover:opacity-100"
          aria-label={`Remove ${tag.name}`}
        >
          <X size={9} strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
}
