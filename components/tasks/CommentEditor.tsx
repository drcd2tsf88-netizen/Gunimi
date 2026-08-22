"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";
import { mergeAttributes } from "@tiptap/core";
import type { SuggestionProps, SuggestionKeyDownProps } from "@tiptap/suggestion";
import {
  Bold, Italic, Underline as UnderlineIcon,
  List, ListOrdered, Loader2, Send, Highlighter, Smile,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useIsHydrated } from "@/lib/hooks/useIsHydrated";
import { cn } from "@/lib/utils";
import CommentMentionList, { type MentionItem } from "./CommentMentionList";
import type { WorkspaceTag } from "@/types/tag";
import type { WorkspaceMember } from "@/types/task";

// ─── Extended Mention nodes ───────────────────────────────────────────────────

const TagMention = Mention.extend({
  name: "tagMention",
  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-mention-type": "tag",
        "data-mention-id": node.attrs.id,
        "data-mention-label": node.attrs.label,
        class: "mention-tag",
      }),
      `#${node.attrs.label ?? ""}`,
    ];
  },
  parseHTML() {
    return [{ tag: 'span[data-mention-type="tag"]' }];
  },
});

const MemberMention = Mention.extend({
  name: "memberMention",
  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-mention-type": "member",
        "data-mention-id": node.attrs.id,
        "data-mention-label": node.attrs.label,
        class: "mention-member",
      }),
      `@${node.attrs.label ?? ""}`,
    ];
  },
  parseHTML() {
    return [{ tag: 'span[data-mention-type="member"]' }];
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────

type MentionPopup = {
  items: MentionItem[];
  selectedIndex: number;
  rect: { top: number; left: number };
  command: (item: MentionItem) => void;
};

type Props = {
  onSubmit: (html: string) => void;
  submitting?: boolean;
  placeholder?: string;
  resetKey?: number;
  tags?: WorkspaceTag[];
  members?: WorkspaceMember[];
};

const EMOJI_LIST = [
  "😀","😂","😍","😎","🤔","😅","🙏","👍","👎","❤️",
  "🔥","✅","⚡","💯","🎉","🙌","👋","🤝","💪","🚀",
  "⭐","💡","📌","🎯","✍️","📝","🗓️","💬","📊","🔔",
  "⚠️","🚧","💥","🛑","✔️","❌","➕","➖","🔄","🔍",
  "😤","😬","🤯","😴","🥳","🫡","🤦","🤷","👀","🫶",
];

function ToolbarBtn({ active, onClick, title, children }: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded transition-colors",
        active
          ? "bg-violet-600/80 text-white"
          : "text-white/30 hover:bg-white/[0.06] hover:text-white/60",
      )}
    >
      {children}
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CommentEditor({
  onSubmit,
  submitting = false,
  placeholder,
  resetKey,
  tags = [],
  members = [],
}: Props) {
  const t = useTranslations("tasks");
  const mounted = useIsHydrated();
  const [emojiOpen, setEmojiOpen] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const [mentionPopup, setMentionPopup] = useState<MentionPopup | null>(null);

  // Keep onSubmit/submitting in refs so the SubmitShortcut extension closure never stales
  const onSubmitRef = useRef(onSubmit);
  const submittingRef = useRef(submitting);
  useEffect(() => { onSubmitRef.current = onSubmit; }, [onSubmit]);
  useEffect(() => { submittingRef.current = submitting; }, [submitting]);

  // Build a suggestion render factory. Uses only:
  //   - local closure variables (no React refs)
  //   - setMentionPopup (stable React state setter — not a ref)
  //   - snapshots of tags / members captured at editor creation time (rarely change)
  function buildSuggestion(
    char: string,
    tagSnapshot: WorkspaceTag[],
    memberSnapshot: WorkspaceMember[],
  ) {
    return {
      char,
      allowSpaces: char === "@",
      items({ query }: { query: string }): MentionItem[] {
        if (char === "#") {
          return tagSnapshot
            .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
            .map((t) => ({ id: t.id, label: t.name, color: t.color }))
            .slice(0, 8);
        }
        return memberSnapshot
          .filter((m) => {
            const name = m.profiles?.full_name ?? m.profiles?.email ?? "";
            return name.toLowerCase().includes(query.toLowerCase());
          })
          .map((m) => ({
            id: m.user_id,
            label: m.profiles?.full_name ?? m.profiles?.email ?? m.user_id,
            email: m.profiles?.email ?? null,
          }))
          .slice(0, 8);
      },
      render() {
        // Local mutable state — updated by Tiptap suggestion callbacks
        let localIdx = 0;
        let localItems: MentionItem[] = [];
        let localCmd: ((item: MentionItem) => void) | null = null;

        return {
          onStart(props: SuggestionProps<MentionItem>) {
            localIdx = 0;
            localItems = props.items;
            localCmd = props.command;
            const rect = props.clientRect?.();
            if (rect) {
              setMentionPopup({ items: props.items, selectedIndex: 0, rect: { top: rect.bottom + 4, left: rect.left }, command: props.command });
            }
          },
          onUpdate(props: SuggestionProps<MentionItem>) {
            localIdx = 0;
            localItems = props.items;
            localCmd = props.command;
            const rect = props.clientRect?.();
            setMentionPopup(rect
              ? { items: props.items, selectedIndex: 0, rect: { top: rect.bottom + 4, left: rect.left }, command: props.command }
              : null
            );
          },
          onKeyDown(props: SuggestionKeyDownProps) {
            const { event } = props;
            if (event.key === "Escape") { setMentionPopup(null); return true; }
            const len = localItems.length;
            if (!len) return false;
            if (event.key === "ArrowDown") {
              localIdx = (localIdx + 1) % len;
              setMentionPopup((p) => p ? { ...p, selectedIndex: localIdx } : null);
              return true;
            }
            if (event.key === "ArrowUp") {
              localIdx = (localIdx + len - 1) % len;
              setMentionPopup((p) => p ? { ...p, selectedIndex: localIdx } : null);
              return true;
            }
            if (event.key === "Enter") {
              const item = localItems[localIdx];
              if (item) localCmd?.(item);
              return true;
            }
            return false;
          },
          onExit() {
            setMentionPopup(null);
          },
        };
      },
    };
  }

  const SubmitShortcut = Extension.create({
    name: "submitShortcut",
    addKeyboardShortcuts() {
      return {
        "Mod-Enter": () => {
          const html = this.editor.getHTML();
          const docText = this.editor.state.doc.textContent;
          const isEmpty = docText.trim().length === 0 && this.editor.state.doc.content.size <= 2;
          if (!isEmpty && !submittingRef.current) {
            onSubmitRef.current(html);
            this.editor.commands.clearContent();
          }
          return true;
        },
      };
    },
  });

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ heading: false, codeBlock: false, blockquote: false, code: false, horizontalRule: false }),
        Underline,
        Highlight.configure({ multicolor: false }),
        Placeholder.configure({ placeholder: placeholder ?? t("commentPlaceholder") }),
        SubmitShortcut,
        TagMention.configure({
          HTMLAttributes: {},
          suggestion: buildSuggestion("#", tags, members),
        }),
        MemberMention.configure({
          HTMLAttributes: {},
          suggestion: buildSuggestion("@", tags, members),
        }),
      ],
      editable: !submitting,
      immediatelyRender: false,
    },
    [resetKey],
  );

  if (!editor) return null;

  const docText = editor.state.doc.textContent;
  const isEmpty = docText.trim().length === 0 && editor.state.doc.content.size <= 2;

  function handleSubmit() {
    if (!editor || submitting) return;
    const docText = editor.state.doc.textContent;
    const empty = docText.trim().length === 0 && editor.state.doc.content.size <= 2;
    if (empty) return;
    onSubmit(editor.getHTML());
    editor.commands.clearContent();
  }

  function insertEmoji(emoji: string) {
    if (!editor) return;
    editor.chain().focus().insertContent(emoji).run();
    setEmojiOpen(false);
  }

  return (
    <>
      <div className={cn(
        "overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] transition-colors focus-within:border-violet-500/35",
        submitting && "opacity-60",
      )}>
        {/* Editor area */}
        <div className="min-h-[60px] px-3 py-2.5">
          <EditorContent
            editor={editor}
            className={[
              "comment-content text-xs text-white/75 outline-none",
              "[&_.tiptap]:outline-none",
              "[&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none",
              "[&_.tiptap_p.is-editor-empty:first-child::before]:text-white/25",
              "[&_.tiptap_p.is-editor-empty:first-child::before]:float-left",
              "[&_.tiptap_p.is-editor-empty:first-child::before]:h-0",
              "[&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
              // Tag pill styling inside editor
              "[&_.mention-tag]:inline-flex [&_.mention-tag]:items-center",
              "[&_.mention-tag]:rounded-md [&_.mention-tag]:border",
              "[&_.mention-tag]:border-violet-500/20 [&_.mention-tag]:bg-violet-500/[0.08]",
              "[&_.mention-tag]:px-1 [&_.mention-tag]:py-0.5",
              "[&_.mention-tag]:text-[11px] [&_.mention-tag]:font-medium [&_.mention-tag]:text-violet-300",
              // Member pill styling inside editor
              "[&_.mention-member]:inline-flex [&_.mention-member]:items-center",
              "[&_.mention-member]:rounded-md [&_.mention-member]:border",
              "[&_.mention-member]:border-cyan-500/20 [&_.mention-member]:bg-cyan-500/[0.08]",
              "[&_.mention-member]:px-1 [&_.mention-member]:py-0.5",
              "[&_.mention-member]:text-[11px] [&_.mention-member]:font-medium [&_.mention-member]:text-cyan-300",
            ].join(" ")}
          />
        </div>

        {/* Footer: toolbar + submit */}
        <div className="flex items-center justify-between gap-2 border-t border-white/[0.05] px-2 py-1.5">
          <div className="flex items-center gap-0.5">
            <ToolbarBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
              <Bold size={11} />
            </ToolbarBtn>
            <ToolbarBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
              <Italic size={11} />
            </ToolbarBtn>
            <ToolbarBtn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
              <UnderlineIcon size={11} />
            </ToolbarBtn>
            <ToolbarBtn active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Highlight">
              <Highlighter size={11} />
            </ToolbarBtn>
            <div className="mx-1 h-3.5 w-px bg-white/[0.08]" />
            <ToolbarBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
              <List size={11} />
            </ToolbarBtn>
            <ToolbarBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered list">
              <ListOrdered size={11} />
            </ToolbarBtn>
            <div className="mx-1 h-3.5 w-px bg-white/[0.08]" />

            {/* Emoji picker */}
            <div className="relative" ref={emojiRef}>
              <ToolbarBtn active={emojiOpen} onClick={() => setEmojiOpen((v) => !v)} title="Emoji">
                <Smile size={11} />
              </ToolbarBtn>
              {emojiOpen && (
                <div
                  className="absolute bottom-full left-0 z-50 mb-2 rounded-xl border border-white/[0.08] bg-[#0E0F1A] p-2 shadow-2xl"
                  style={{ width: 220 }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div className="grid grid-cols-10 gap-0.5">
                    {EMOJI_LIST.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="flex h-[22px] w-[22px] items-center justify-center rounded text-[14px] transition-colors hover:bg-white/[0.07]"
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-2">
            <span className="hidden text-[10px] text-white/20 sm:block">⌘↵</span>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isEmpty || submitting}
              className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1 text-[11px] font-medium text-white transition-all hover:bg-violet-500 disabled:opacity-35"
            >
              {submitting ? <Loader2 size={10} className="animate-spin" /> : <Send size={10} />}
              {t("commentSubmit")}
            </button>
          </div>
        </div>
      </div>

      {/* Mention popup — portal */}
      {mounted && mentionPopup && mentionPopup.items.length > 0 &&
        createPortal(
          <div style={{ position: "fixed", top: mentionPopup.rect.top, left: mentionPopup.rect.left, zIndex: 200 }}>
            <CommentMentionList
              items={mentionPopup.items}
              selectedIndex={mentionPopup.selectedIndex}
              command={mentionPopup.command}
            />
          </div>,
          document.body,
        )
      }
    </>
  );
}
