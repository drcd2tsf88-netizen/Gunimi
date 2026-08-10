"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Smile,
  Underline as UnderlineIcon,
} from "lucide-react";
import { useEffect } from "react";
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
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
};

function ToolbarButton({
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
      className={`flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors ${
        active
          ? "bg-violet-600 text-white"
          : "text-white/40 hover:bg-white/[0.06] hover:text-white/70"
      }`}
    >
      {children}
    </button>
  );
}

export default function NoteEditor({ content, onChange, placeholder = "", disabled = false, minHeight = "120px" }: Props) {
  const t = useTranslations("notes");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    editable: !disabled,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor || !content) return;
    const current = editor.getHTML();
    if (current !== content) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor) return null;

  function insertEmoji(emoji: string) {
    editor?.chain().focus().insertContent(emoji).run();
    setEmojiOpen(false);
  }

  return (
    <div className={`tiptap-editor overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] transition-colors focus-within:border-violet-500/40 ${disabled ? "opacity-50" : ""}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b border-white/[0.06] px-2 py-1.5">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title={t("toolbarBold")}
        >
          <Bold size={12} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title={t("toolbarItalic")}
        >
          <Italic size={12} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title={t("toolbarUnderline")}
        >
          <UnderlineIcon size={12} />
        </ToolbarButton>
        <div className="mx-1.5 h-4 w-px bg-white/[0.08]" />
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title={t("toolbarHeading")}
        >
          <Heading2 size={12} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title={t("toolbarBulletList")}
        >
          <List size={12} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title={t("toolbarOrderedList")}
        >
          <ListOrdered size={12} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title={t("toolbarCode")}
        >
          <Code size={12} />
        </ToolbarButton>
        <div className="mx-1.5 h-4 w-px bg-white/[0.08]" />
        <ToolbarButton
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title={t("toolbarAlignLeft")}
        >
          <AlignLeft size={12} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title={t("toolbarAlignCenter")}
        >
          <AlignCenter size={12} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title={t("toolbarAlignRight")}
        >
          <AlignRight size={12} />
        </ToolbarButton>
        <div className="mx-1.5 h-4 w-px bg-white/[0.08]" />
        <div className="relative" ref={emojiRef}>
          <ToolbarButton
            active={emojiOpen}
            onClick={() => setEmojiOpen((v) => !v)}
            title="Emoji"
          >
            <Smile size={12} />
          </ToolbarButton>
          {emojiOpen && (
            <div
              className="absolute left-0 top-full z-50 mt-1 rounded-xl border border-white/[0.08] bg-[#0E0F1A] p-2 shadow-2xl"
              style={{ width: 220 }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-10 gap-0.5">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className={cn("flex h-[22px] w-[22px] items-center justify-center rounded text-[14px] transition-colors hover:bg-white/[0.07]")}
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

      {/* Editor area */}
      <div className="px-4 py-3" style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
