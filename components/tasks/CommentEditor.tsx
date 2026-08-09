"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Loader2, Send, Highlighter, Smile } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const EMOJI_LIST = [
  "😀","😂","😍","😎","🤔","😅","🙏","👍","👎","❤️",
  "🔥","✅","⚡","💯","🎉","🙌","👋","🤝","💪","🚀",
  "⭐","💡","📌","🎯","✍️","📝","🗓️","💬","📊","🔔",
  "⚠️","🚧","💥","🛑","✔️","❌","➕","➖","🔄","🔍",
  "😤","😬","🤯","😴","🥳","🫡","🤦","🤷","👀","🫶",
];

type Props = {
  onSubmit: (html: string) => void;
  submitting?: boolean;
  placeholder?: string;
  resetKey?: number;
};

function ToolbarBtn({
  active,
  onClick,
  title,
  children,
}: {
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

export default function CommentEditor({ onSubmit, submitting = false, placeholder, resetKey }: Props) {
  const t = useTranslations("tasks");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  const SubmitShortcut = Extension.create({
    name: "submitShortcut",
    addKeyboardShortcuts() {
      return {
        "Mod-Enter": () => {
          const html = this.editor.getHTML();
          const isEmpty = this.editor.state.doc.textContent.trim() === "";
          if (!isEmpty && !submitting) {
            onSubmit(html);
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
      ],
      editable: !submitting,
      immediatelyRender: false,
    },
    [resetKey],
  );

  if (!editor) return null;

  const isEmpty = editor.state.doc.textContent.trim() === "";

  function handleSubmit() {
    if (!editor || isEmpty || submitting) return;
    onSubmit(editor.getHTML());
    editor.commands.clearContent();
  }

  function insertEmoji(emoji: string) {
    if (!editor) return;
    editor.chain().focus().insertContent(emoji).run();
    setEmojiOpen(false);
  }

  return (
    <div className={cn(
      "overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] transition-colors focus-within:border-violet-500/35",
      submitting && "opacity-60",
    )}>
      {/* Editor */}
      <div className="px-3 py-2.5 min-h-[60px]">
        <EditorContent
          editor={editor}
          className="comment-content text-xs text-white/75 outline-none [&_.tiptap]:outline-none [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:text-white/25 [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
        />
      </div>

      {/* Footer: toolbar + submit */}
      <div className="flex items-center justify-between gap-2 border-t border-white/[0.05] px-2 py-1.5">
        {/* Toolbar */}
        <div className="flex items-center gap-0.5">
          <ToolbarBtn
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <Bold size={11} />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <Italic size={11} />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            <UnderlineIcon size={11} />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("highlight")}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            title="Highlight"
          >
            <Highlighter size={11} />
          </ToolbarBtn>
          <div className="mx-1 h-3.5 w-px bg-white/[0.08]" />
          <ToolbarBtn
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet list"
          >
            <List size={11} />
          </ToolbarBtn>
          <ToolbarBtn
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Ordered list"
          >
            <ListOrdered size={11} />
          </ToolbarBtn>
          <div className="mx-1 h-3.5 w-px bg-white/[0.08]" />

          {/* Emoji picker */}
          <div className="relative" ref={emojiRef}>
            <ToolbarBtn
              active={emojiOpen}
              onClick={() => setEmojiOpen((v) => !v)}
              title="Emoji"
            >
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
            {submitting ? (
              <Loader2 size={10} className="animate-spin" />
            ) : (
              <Send size={10} />
            )}
            {t("commentSubmit")}
          </button>
        </div>
      </div>
    </div>
  );
}
