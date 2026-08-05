import Link from "next/link";
import { X } from "lucide-react";
import { TAG_COLOR_CLASSES } from "@/types/tag";
import type { WorkspaceTag } from "@/types/tag";

type Props = {
  tag: WorkspaceTag;
  onRemove?: () => void;
  size?: "sm" | "xs";
  href?: string;
};

export default function TagBadge({ tag, onRemove, size = "sm", href }: Props) {
  const colors = TAG_COLOR_CLASSES[tag.color] ?? TAG_COLOR_CLASSES.violet;

  const className = [
    "inline-flex items-center gap-1 rounded-full border font-medium transition-colors",
    size === "xs" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
    colors.bg,
    colors.text,
    colors.border,
    href ? "hover:brightness-110 cursor-pointer" : "",
  ].join(" ");

  const inner = (
    <>
      {tag.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full opacity-60 transition-opacity hover:opacity-100"
          aria-label={`Remove ${tag.name}`}
        >
          <X size={9} strokeWidth={2.5} />
        </button>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return <span className={className}>{inner}</span>;
}
