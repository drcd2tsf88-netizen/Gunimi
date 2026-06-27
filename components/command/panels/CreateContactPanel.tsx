"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { PanelSubmitItem } from "./PanelSubmitItem";
import { PanelEmptyState } from "./PanelEmptyState";
import { PanelError } from "./PanelError";
import { panelInputClass } from "./panelStyles";

export interface ContactExtra {
  email: string;
  phone: string;
}

interface CreateContactPanelProps {
  query: string;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (extra: ContactExtra) => void;
  defaultValues?: Record<string, string>;
  onDraftChange?: (draft: Record<string, string>) => void;
}

export default function CreateContactPanel({
  query,
  isSubmitting,
  error,
  onSubmit,
  defaultValues,
  onDraftChange,
}: CreateContactPanelProps) {
  const t = useTranslations("command");
  const [email, setEmail] = useState(defaultValues?.email ?? "");
  const [phone, setPhone] = useState(defaultValues?.phone ?? "");
  const name = query.trim();

  function handleSubmit() {
    onSubmit({ email: email.trim(), phone: phone.trim() });
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    onDraftChange?.({ email: value, phone });
  }

  function handlePhoneChange(value: string) {
    setPhone(value);
    onDraftChange?.({ email, phone: value });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
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
            value="create-contact-submit"
            title={
              isSubmitting
                ? t("createContactSubmittingLabel")
                : `${t("createContactSubmitPrefix")} "${name}"`
            }
            hint={t("createContactSubmitHint")}
            badgeLabel={t("createContactSubmitKey")}
            icon={UserPlus}
            onSubmit={handleSubmit}
          />

          <div className="mt-2 flex flex-col gap-2 px-4 pb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("createContactEmailPlaceholder")}
              disabled={isSubmitting}
              className={panelInputClass}
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("createContactPhonePlaceholder")}
              disabled={isSubmitting}
              className={panelInputClass}
            />
          </div>
        </>
      ) : (
        <PanelEmptyState
          hint={t("createContactHint")}
          backHint={t("createContactBackHint")}
        />
      )}

      {error && <PanelError message={error} />}
    </>
  );
}
