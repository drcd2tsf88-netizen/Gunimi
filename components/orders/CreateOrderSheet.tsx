"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { createOrder } from "@/server/actions/orders/createOrder";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiInput from "@/components/ui/GunimiInput";
import GunimiTextarea from "@/components/ui/GunimiTextarea";
import GunimiField from "@/components/ui/GunimiField";
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
import type { Company } from "@/types/company";
import type { Contact } from "@/types/contact";
import type { Deal } from "@/types/deal";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companies: Company[];
  contacts: Contact[];
  deals: Deal[];
  prefillCompanyId?: string;
  prefillContactId?: string;
  prefillDealId?: string;
  prefillTitle?: string;
  prefillNotes?: string;
};

export default function CreateOrderSheet({
  open,
  onOpenChange,
  companies,
  contacts,
  deals,
  prefillCompanyId,
  prefillContactId,
  prefillDealId,
  prefillTitle,
  prefillNotes,
}: Props) {
  const t = useTranslations("orders");
  const tc = useTranslations("common");
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(prefillTitle ?? "");
  const [notes, setNotes] = useState(prefillNotes ?? "");
  const [companyId, setCompanyId] = useState(prefillCompanyId ?? "");
  const [contactId, setContactId] = useState(prefillContactId ?? "");
  const [dealId, setDealId] = useState(prefillDealId ?? "");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("EUR");

  // Filter contacts by selected company
  const filteredContacts = companyId
    ? contacts.filter((c) => c.company_id === companyId)
    : contacts;

  function reset() {
    setTitle(prefillTitle ?? "");
    setNotes(prefillNotes ?? "");
    setCompanyId(prefillCompanyId ?? "");
    setContactId(prefillContactId ?? "");
    setDealId(prefillDealId ?? "");
    setDueDate("");
    setCurrency("EUR");
  }

  function handleCompanyChange(val: string) {
    setCompanyId(val);
    // Reset contact if it no longer belongs to the new company
    if (contactId && val) {
      const still = contacts.find((c) => c.id === contactId && c.company_id === val);
      if (!still) setContactId("");
    }
  }

  function handleSubmit() {
    if (!title.trim()) return;
    startTransition(async () => {
      const order = await createOrder({
        title: title.trim(),
        notes: notes.trim() || undefined,
        currency,
        due_date: dueDate || undefined,
        company_id: companyId || undefined,
        contact_id: contactId || undefined,
        deal_id: dealId || undefined,
      });
      if (order) {
        toast.success(t("orderCreated"));
        onOpenChange(false);
        reset();
        router.push(`/dashboard/orders/${order.id}`);
      } else {
        toast.error(t("failedToCreateOrder"));
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <SheetContent className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>{t("createOrder")}</SheetTitle>
          <SheetDescription>{t("createOrderDescription")}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <GunimiField label={t("titleLabel")}>
            <GunimiInput
              placeholder={t("titlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </GunimiField>

          <GunimiField label={t("companyLabel")}>
            <Select value={companyId} onValueChange={handleCompanyChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("companyPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </GunimiField>

          {filteredContacts.length > 0 && (
            <GunimiField label={t("contactLabel")}>
              <Select value={contactId} onValueChange={setContactId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("contactPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {filteredContacts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </GunimiField>
          )}

          {deals.length > 0 && (
            <GunimiField label={t("dealLabel")}>
              <Select value={dealId} onValueChange={setDealId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("dealPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {deals.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </GunimiField>
          )}

          <GunimiField label={t("currencyLabel")}>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="CZK">CZK</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </GunimiField>

          <GunimiField label={t("dueDateLabel")}>
            <GunimiInput
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </GunimiField>

          <GunimiField label={t("notesLabel")}>
            <GunimiTextarea
              placeholder={t("notesPlaceholder")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </GunimiField>
        </div>

        <SheetFooter className="mt-8">
          <GunimiButton
            variant="secondary"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            {tc("cancel")}
          </GunimiButton>
          <GunimiButton
            variant="primary"
            loading={isPending}
            disabled={!title.trim()}
            onClick={handleSubmit}
          >
            {t("createOrder")}
          </GunimiButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
