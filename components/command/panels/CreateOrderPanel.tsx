"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
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

export interface OrderExtra {
  notes: string;
  companyId: string;
  contactId: string;
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
    onDraftChange?.({ notes, companyId: normalized, contactId: "" });
  }

  function handleContactChange(val: string) {
    const normalized = val === "__none__" ? "" : val;
    setContactId(normalized);
    onDraftChange?.({ notes, companyId, contactId: normalized });
  }

  function handleSubmit() {
    if (!companyId && !contactId) return;
    onSubmit({ notes: notes.trim(), companyId, contactId });
  }

  function handleNotesChange(next: string) {
    setNotes(next);
    onDraftChange?.({ notes: next, companyId, contactId });
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
            value="create-order-submit"
            title={
              isSubmitting
                ? t("createOrderSubmitPrefix") + "..."
                : `${t("createOrderSubmitPrefix")} "${name}"`
            }
            hint={
              canSubmit
                ? t("createOrderSubmitHint")
                : t("createOrderRequireEntity")
            }
            badgeLabel={t("createOrderSubmitKey")}
            icon={ShoppingBag}
            onSubmit={handleSubmit}
          />

          <div className="mt-2 flex flex-col gap-2 px-4 pb-4">
            <Select value={companyId || undefined} onValueChange={handleCompanyChange} disabled={isSubmitting}>
              <SelectTrigger className="border-white/10 bg-white/[0.03]">
                <SelectValue placeholder={t("createOrderCompanyPlaceholder")} />
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
                <SelectValue placeholder={t("createOrderContactPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {contactId && <SelectItem value="__none__">{t("selectClearOption")}</SelectItem>}
                {filteredContacts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

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
