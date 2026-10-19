"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { PanelSubmitItem } from "./PanelSubmitItem";
import { PanelEmptyState } from "./PanelEmptyState";
import { PanelError } from "./PanelError";
import { panelInputClass } from "./panelStyles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCompanies } from "@/server/actions/company/getCompanies";
import { getContacts } from "@/server/actions/crm/getContacts";

type CompanyItem = { id: string; name: string };
type ContactItem = { id: string; name: string; company_id: string | null };

export interface DealExtra {
  value: string;
  notes: string;
  companyId: string;
  contactId: string;
}

interface CreateDealPanelProps {
  query: string;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (extra: DealExtra) => void;
  defaultValues?: Record<string, string>;
  onDraftChange?: (draft: Record<string, string>) => void;
}

export default function CreateDealPanel({
  query,
  isSubmitting,
  error,
  onSubmit,
  defaultValues,
  onDraftChange,
}: CreateDealPanelProps) {
  const t = useTranslations("command");
  const [value, setValue] = useState(defaultValues?.value ?? "");
  const [notes, setNotes] = useState(defaultValues?.notes ?? "");
  const [companyId, setCompanyId] = useState(defaultValues?.companyId ?? "");
  const [contactId, setContactId] = useState(defaultValues?.contactId ?? "");
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const name = query.trim();

  useEffect(() => {
    getCompanies().then(setCompanies).catch(() => {});
    getContacts().then(setContacts).catch(() => {});
  }, []);

  const filteredContacts = companyId
    ? contacts.filter((c) => c.company_id === companyId)
    : contacts;

  function handleCompanyChange(val: string) {
    const normalized = val === "__none__" ? "" : val;
    setCompanyId(normalized);
    setContactId("");
    onDraftChange?.({ value, notes, companyId: normalized, contactId: "" });
  }

  function handleContactChange(val: string) {
    const normalized = val === "__none__" ? "" : val;
    setContactId(normalized);
    onDraftChange?.({ value, notes, companyId, contactId: normalized });
  }

  function handleSubmit() {
    if (!companyId && !contactId) return;
    onSubmit({ value: value.trim(), notes: notes.trim(), companyId, contactId });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    }
  }

  const canSubmit = !!(companyId || contactId);

  return (
    <>
      {name ? (
        <>
          <PanelSubmitItem
            value="create-deal-submit"
            title={
              isSubmitting
                ? t("createDealSubmittingLabel")
                : `${t("createDealSubmitPrefix")} "${name}"`
            }
            hint={
              canSubmit
                ? t("createDealSubmitHint")
                : t("createDealRequireEntity")
            }
            badgeLabel={t("createDealSubmitKey")}
            icon={TrendingUp}
            onSubmit={handleSubmit}
          />

          <div className="mt-2 flex flex-col gap-2 px-4 pb-4">
            <Select value={companyId || undefined} onValueChange={handleCompanyChange} disabled={isSubmitting}>
              <SelectTrigger className="border-white/10 bg-white/[0.03]">
                <SelectValue placeholder={t("createDealCompanyPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {companyId && <SelectItem value="__none__">{t("selectClearOption")}</SelectItem>}
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={contactId || undefined} onValueChange={handleContactChange} disabled={isSubmitting}>
              <SelectTrigger className="border-white/10 bg-white/[0.03]">
                <SelectValue placeholder={t("createDealContactPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {contactId && <SelectItem value="__none__">{t("selectClearOption")}</SelectItem>}
                {filteredContacts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <input
              type="text"
              value={value}
              onChange={(e) => { setValue(e.target.value); onDraftChange?.({ value: e.target.value, notes, companyId, contactId }); }}
              onKeyDown={handleKeyDown}
              placeholder={t("createDealValuePlaceholder")}
              disabled={isSubmitting}
              className={panelInputClass}
            />
            <textarea
              value={notes}
              onChange={(e) => { setNotes(e.target.value); onDraftChange?.({ value, notes: e.target.value, companyId, contactId }); }}
              onKeyDown={handleKeyDown}
              placeholder={t("createDealNotesPlaceholder")}
              disabled={isSubmitting}
              rows={2}
              className={`${panelInputClass} resize-none`}
            />
          </div>
        </>
      ) : (
        <PanelEmptyState
          hint={t("createDealHint")}
          backHint={t("createDealBackHint")}
        />
      )}

      {error && <PanelError message={error} />}
    </>
  );
}
