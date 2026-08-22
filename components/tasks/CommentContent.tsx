"use client";

import { useMemo } from "react";
import parse from "html-react-parser";
import type { DOMNode } from "html-react-parser";
import TagHoverCard from "@/components/ui/TagHoverCard";
import MemberHoverCard from "@/components/ui/MemberHoverCard";
import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";
import { TAG_COLOR_CLASSES } from "@/types/tag";
import type { WorkspaceTag } from "@/types/tag";
import type { WorkspaceMember } from "@/types/task";

type Props = {
  html: string;
  tags: WorkspaceTag[];
  members: WorkspaceMember[];
};

type ParsedElement = DOMNode & {
  type: string;
  name?: string;
  attribs?: Record<string, string>;
};

export default function CommentContent({ html, tags, members }: Props) {
  const tagMap = useMemo(() => new Map(tags.map((t) => [t.id, t])), [tags]);
  const memberMap = useMemo(() => new Map(members.map((m) => [m.user_id, m])), [members]);

  const content = useMemo(() => {
    const clean = sanitizeHtml(html);

    return parse(clean, {
      replace(rawNode: DOMNode) {
        const node = rawNode as ParsedElement;
        if (node.type !== "tag" || node.name !== "span" || !node.attribs) return;

        const mentionType = node.attribs["data-mention-type"];
        const id = node.attribs["data-mention-id"];
        const label = node.attribs["data-mention-label"] ?? "";

        if (mentionType === "tag" && id) {
          const tag = tagMap.get(id);
          const colors = tag
            ? (TAG_COLOR_CLASSES[tag.color] ?? TAG_COLOR_CLASSES.violet)
            : TAG_COLOR_CLASSES.violet;

          const chip = (
            <span
              className={`inline-flex cursor-default items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium transition-opacity hover:opacity-80 ${colors.bg} ${colors.text} ${colors.border}`}
            >
              #{label}
            </span>
          );

          if (!tag) return chip;

          return (
            <TagHoverCard tag={tag}>
              {chip}
            </TagHoverCard>
          );
        }

        if (mentionType === "member" && id) {
          const member = memberMap.get(id);
          const name = member?.profiles?.full_name ?? label;
          const email = member?.profiles?.email ?? null;

          const chip = (
            <span className="inline-flex cursor-default items-center rounded-md border border-cyan-500/20 bg-cyan-500/[0.08] px-1.5 py-0.5 text-[11px] font-medium text-cyan-300 transition-opacity hover:opacity-80">
              @{name}
            </span>
          );

          return (
            <MemberHoverCard userId={id} name={name} email={email}>
              {chip}
            </MemberHoverCard>
          );
        }
      },
    });
  }, [html, tagMap, memberMap]);

  return (
    <div className="comment-content text-xs leading-relaxed text-white/60">
      {content}
    </div>
  );
}
