"use client";

import { ClipboardCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { PanelSubmitItem } from "./PanelSubmitItem";
import { PanelEmptyState } from "./PanelEmptyState";
import { PanelError } from "./PanelError";

interface CreateTaskPanelProps {
  query: string;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: () => void;
}

export default function CreateTaskPanel({
  query,
  isSubmitting,
  error,
  onSubmit,
}: CreateTaskPanelProps) {
  const t = useTranslations("command");
  const title = query.trim();

  return (
    <>
      {title ? (
        <PanelSubmitItem
          value="create-task-submit"
          title={isSubmitting ? t("createTaskSubmittingLabel") : `${t("createTaskSubmitPrefix")} "${title}"`}
          hint={t("createTaskSubmitHint")}
          badgeLabel={t("createTaskSubmitKey")}
          icon={ClipboardCheck}
          onSubmit={onSubmit}
        />
      ) : (
        <PanelEmptyState
          hint={t("createTaskHint")}
          backHint={t("createTaskBackHint")}
        />
      )}

      {error && <PanelError message={error} />}
    </>
  );
}
