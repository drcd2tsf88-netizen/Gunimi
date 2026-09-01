"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import GunimiButton from "@/components/ui/GunimiButton";
import { replyToThread } from "@/server/actions/email/replyToThread";
import { getAiEmailDraft } from "@/server/actions/email/getAiEmailDraft";

type Props = {
  threadId: string;
  threadSubject?: string | null;
  recipientEmail?: string;
  contactId?: string;
  onSent?: () => void;
};

export default function ReplyComposer({
  threadId,
  threadSubject,
  recipientEmail = "",
  contactId,
  onSent,
}: Props) {
  const t = useTranslations("email");
  const [body, setBody] = useState("");
  const [isSending, startSend] = useTransition();
  const [isDrafting, startDraft] = useTransition();

  function handleAiDraft() {
    startDraft(async () => {
      const draft = await getAiEmailDraft({
        contactId,
        threadSubject: threadSubject ?? undefined,
        recipientEmail,
      });
      if (draft) setBody(draft);
      else toast.error(t("aiDraftFailed"));
    });
  }

  function handleSend() {
    if (!body.trim()) return;
    startSend(async () => {
      const result = await replyToThread(threadId, body.trim());
      if (result.ok) {
        toast.success(t("replySent"));
        setBody("");
        onSent?.();
      } else if (result.error === "reconnect_required") {
        toast.error(t("reconnectRequired"));
      } else {
        toast.error(t("replyFailed"));
      }
    });
  }

  return (
    <div className="border-t border-white/[0.06] px-6 py-4">
      <p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-zinc-500">{t("replyLabel")}</p>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={t("replyPlaceholder")}
        rows={4}
        className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/80 placeholder:text-white/25 focus:border-violet-500/40 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <GunimiButton
          variant="secondary"
          className="gap-2 text-xs"
          onClick={handleAiDraft}
          disabled={isDrafting || isSending}
        >
          {isDrafting
            ? <Loader2 size={12} className="animate-spin" />
            : <Sparkles size={12} className="text-violet-400" />}
          {t("aiDraft")}
        </GunimiButton>
        <GunimiButton
          variant="primary"
          className="gap-2 text-xs"
          onClick={handleSend}
          loading={isSending}
          disabled={!body.trim() || isDrafting}
        >
          <Send size={12} />
          {t("sendReply")}
        </GunimiButton>
      </div>
    </div>
  );
}
