"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GunimiField from "@/components/ui/GunimiField";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiTextarea from "@/components/ui/GunimiTextarea";

import { useDogfoodStore } from "@/lib/store/dogfood-store";
import { submitFeedback } from "@/server/actions/dogfood/submitFeedback";
import type { FeedbackCategory, FeedbackSeverity } from "@/server/actions/dogfood/submitFeedback";

const CATEGORIES: FeedbackCategory[] = [
  "ux", "bug", "performance", "copy", "ai",
  "signal", "today", "workspace", "settings", "other",
];

const SEVERITIES: FeedbackSeverity[] = ["low", "medium", "high", "critical"];

export default function FeedbackSheet() {
  const t = useTranslations("dogfood");
  const { isOpen, closeFeedback } = useDogfoodStore();

  const [category, setCategory] = useState<FeedbackCategory>("ux");
  const [severity, setSeverity] = useState<FeedbackSeverity>("medium");
  const [message, setMessage] = useState("");
  const [sessionNote, setSessionNote] = useState(false);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setCategory("ux");
    setSeverity("medium");
    setMessage("");
    setSessionNote(false);
  }

  function handleClose() {
    closeFeedback();
    reset();
  }

  function handleSubmit() {
    if (!message.trim()) return;

    const route = typeof window !== "undefined" ? window.location.pathname : null;
    const browser = typeof navigator !== "undefined" ? navigator.userAgent : null;
    const viewport =
      typeof window !== "undefined"
        ? `${window.innerWidth}x${window.innerHeight}`
        : null;
    const language =
      typeof navigator !== "undefined" ? navigator.language : null;
    const timezone =
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : null;

    startTransition(async () => {
      const ok = await submitFeedback({
        category,
        severity,
        message,
        sessionNote,
        route,
        browser,
        viewport,
        language,
        timezone,
      });
      if (ok) {
        toast.success(t("submitted"));
        handleClose();
      } else {
        toast.error(t("failed"));
      }
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <SheetContent className="max-w-[440px]">
        <SheetHeader>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6D5BFF]/60">
            {t("dashboardBadge")}
          </p>
          <SheetTitle>{t("feedbackTitle")}</SheetTitle>
          <SheetDescription>{t("feedbackSubtitle")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-5">

            <div className="grid grid-cols-2 gap-4">
              <GunimiField label={t("category")}>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as FeedbackCategory)}
                  disabled={isPending}
                >
                  <SelectTrigger aria-label={t("category")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {t(`category_${c}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </GunimiField>

              <GunimiField label={t("severity")}>
                <Select
                  value={severity}
                  onValueChange={(v) => setSeverity(v as FeedbackSeverity)}
                  disabled={isPending}
                >
                  <SelectTrigger aria-label={t("severity")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITIES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {t(`severity_${s}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </GunimiField>
            </div>

            <GunimiField label={t("message")}>
              <GunimiTextarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("messagePlaceholder")}
                disabled={isPending}
                rows={5}
              />
            </GunimiField>

            {/* Session note toggle */}
            <button
              type="button"
              onClick={() => setSessionNote((v) => !v)}
              disabled={isPending}
              className="flex w-full items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-white/[0.10] hover:bg-white/[0.04]"
            >
              <div
                className={[
                  "mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded",
                  "border transition-colors duration-150",
                  sessionNote
                    ? "border-[#6D5BFF] bg-[#6D5BFF]"
                    : "border-white/20 bg-transparent",
                ].join(" ")}
              >
                {sessionNote && (
                  <svg
                    viewBox="0 0 10 8"
                    fill="none"
                    className="h-2.5 w-2.5"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="1,4 4,7 9,1" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-[13px] font-medium text-white/80">
                  {t("sessionNote")}
                </p>
                <p className="mt-0.5 text-[11px] text-white/35">{t("sessionNoteHint")}</p>
              </div>
            </button>

          </div>
        </div>

        <SheetFooter>
          <GunimiButton variant="secondary" onClick={handleClose} disabled={isPending}>
            Cancel
          </GunimiButton>
          <GunimiButton
            onClick={handleSubmit}
            loading={isPending}
            disabled={!message.trim() || isPending}
          >
            {isPending ? t("submitting") : t("submit")}
          </GunimiButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
