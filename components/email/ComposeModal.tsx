"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { X, Sparkles, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiInput from "@/components/ui/GunimiInput";
import { composeEmail } from "@/server/actions/email/composeEmail";
import { getAiEmailDraft } from "@/server/actions/email/getAiEmailDraft";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultTo?: string;
  defaultSubject?: string;
  contactId?: string;
};

export default function ComposeModal({ open, onClose, defaultTo = "", defaultSubject = "", contactId }: Props) {
  const t = useTranslations("email");
  const [to, setTo] = useState(defaultTo);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState("");
  const [isSending, startSend] = useTransition();
  const [isDrafting, startDraft] = useTransition();

  if (!open) return null;

  function handleAiDraft() {
    startDraft(async () => {
      const draft = await getAiEmailDraft({
        contactId,
        threadSubject: subject || undefined,
        recipientEmail: to,
      });
      if (draft) setBody(draft);
      else toast.error(t("aiDraftFailed"));
    });
  }

  function handleSend() {
    if (!to.trim() || !subject.trim() || !body.trim()) return;
    startSend(async () => {
      const result = await composeEmail(to.trim(), subject.trim(), body.trim(), contactId);
      if (result.ok) {
        toast.success(t("emailSent"));
        onClose();
      } else if (result.error === "reconnect_required") {
        toast.error(t("reconnectRequired"));
      } else if (result.error === "no_connection") {
        toast.error(t("noEmailConnection"));
      } else {
        toast.error(t("sendFailed"));
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 backdrop-blur-sm sm:items-center sm:justify-center" onClick={onClose}>
      <div
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-white/[0.08] bg-[#060816]/95 backdrop-blur-3xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <p className="text-sm font-semibold text-white/80">{t("composeTitle")}</p>
          <button onClick={onClose} className="rounded-xl border border-white/[0.08] p-1.5 text-white/40 transition-colors hover:text-white/70">
            <X size={14} />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-3 px-6 py-4">
          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-zinc-500">{t("composeTo")}</label>
            <GunimiInput
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-zinc-500">{t("composeSubject")}</label>
            <GunimiInput
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("composeSubjectPlaceholder")}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-zinc-500">{t("composeBody")}</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t("composeBodyPlaceholder")}
              rows={6}
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/80 placeholder:text-white/25 focus:border-violet-500/40 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] px-6 py-4">
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
          <div className="flex items-center gap-2">
            <GunimiButton variant="secondary" className="text-xs" onClick={onClose} disabled={isSending}>
              {t("composeCancel")}
            </GunimiButton>
            <GunimiButton
              variant="primary"
              className="gap-2 text-xs"
              onClick={handleSend}
              loading={isSending}
              disabled={!to.trim() || !subject.trim() || !body.trim() || isDrafting}
            >
              <Send size={12} />
              {t("sendEmail")}
            </GunimiButton>
          </div>
        </div>
      </div>
    </div>
  );
}
