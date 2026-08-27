"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { PanelSubmitItem } from "./PanelSubmitItem";
import { PanelEmptyState } from "./PanelEmptyState";
import { PanelError } from "./PanelError";
import { panelInputClass } from "./panelStyles";

export interface OrderExtra {
  notes: string;
}

interface CreateOrderPanelProps {
  query: string;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (extra: OrderExtra) => void;
  defaultValues?: Record<string, string>;
  onDraftChange?: (draft: Record<string, string>) => void;
}

export default function CreateOrderPanel({
  query,
  isSubmitting,
  error,
  onSubmit,
  defaultValues,
  onDraftChange,
}: CreateOrderPanelProps) {
  const t = useTranslations("command");
  const [notes, setNotes] = useState(defaultValues?.notes ?? "");
  const name = query.trim();

  function handleSubmit() {
    onSubmit({ notes: notes.trim() });
  }

  function handleNotesChange(next: string) {
    setNotes(next);
    onDraftChange?.({ notes: next });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    }
  }

  return (
    <>
      {name ? (
        <>
          <PanelSubmitItem
            value="create-order-submit"
            title={
              isSubmitting
                ? t("createOrderSubmitPrefix") + "..."
                : `${t("createOrderSubmitPrefix")} "${name}"`
            }
            hint={t("createOrderSubmitHint")}
            badgeLabel={t("createOrderSubmitKey")}
            icon={ShoppingBag}
            onSubmit={handleSubmit}
          />

          <div className="mt-2 flex flex-col gap-2 px-4 pb-4">
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("createOrderNotesPlaceholder")}
              disabled={isSubmitting}
              rows={2}
              className={`${panelInputClass} resize-none`}
            />
          </div>
        </>
      ) : (
        <PanelEmptyState
          hint={t("createOrderHint")}
          backHint={t("createOrderBackHint")}
        />
      )}

      {error && <PanelError message={error} />}
    </>
  );
}
