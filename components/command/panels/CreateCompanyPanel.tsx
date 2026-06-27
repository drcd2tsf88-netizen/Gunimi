"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { PanelSubmitItem } from "./PanelSubmitItem";
import { PanelEmptyState } from "./PanelEmptyState";
import { PanelError } from "./PanelError";
import { panelInputClass } from "./panelStyles";

export interface CompanyExtra {
  industry: string;
  notes: string;
}

interface CreateCompanyPanelProps {
  query: string;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (extra: CompanyExtra) => void;
  defaultValues?: Record<string, string>;
  onDraftChange?: (draft: Record<string, string>) => void;
}

export default function CreateCompanyPanel({
  query,
  isSubmitting,
  error,
  onSubmit,
  defaultValues,
  onDraftChange,
}: CreateCompanyPanelProps) {
  const t = useTranslations("command");
  const [industry, setIndustry] = useState(defaultValues?.industry ?? "");
  const [notes, setNotes] = useState(defaultValues?.notes ?? "");
  const name = query.trim();

  function handleSubmit() {
    onSubmit({ industry: industry.trim(), notes: notes.trim() });
  }

  function handleIndustryChange(value: string) {
    setIndustry(value);
    onDraftChange?.({ industry: value, notes });
  }

  function handleNotesChange(value: string) {
    setNotes(value);
    onDraftChange?.({ industry, notes: value });
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
            value="create-company-submit"
            title={
              isSubmitting
                ? t("createCompanySubmittingLabel")
                : `${t("createCompanySubmitPrefix")} "${name}"`
            }
            hint={t("createCompanySubmitHint")}
            badgeLabel={t("createCompanySubmitKey")}
            icon={Building2}
            onSubmit={handleSubmit}
          />

          <div className="mt-2 flex flex-col gap-2 px-4 pb-4">
            <input
              type="text"
              value={industry}
              onChange={(e) => handleIndustryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("createCompanyIndustryPlaceholder")}
              disabled={isSubmitting}
              className={panelInputClass}
            />
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("createCompanyNotesPlaceholder")}
              disabled={isSubmitting}
              rows={2}
              className={`${panelInputClass} resize-none`}
            />
          </div>
        </>
      ) : (
        <PanelEmptyState
          hint={t("createCompanyHint")}
          backHint={t("createCompanyBackHint")}
        />
      )}

      {error && <PanelError message={error} />}
    </>
  );
}
