"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { updateOrder } from "@/server/actions/orders/updateOrder";
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
import type { Order } from "@/types/order";
import type { Company } from "@/types/company";
import type { Contact } from "@/types/contact";
import type { Deal } from "@/types/deal";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
  companies: Company[];
  contacts: Contact[];
  deals: Deal[];
};

export default function EditOrderSheet({ open, onOpenChange, order, companies, contacts, deals }: Props) {
  const t = useTranslations("orders");
  const tc = useTranslations("common");
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(order.title);
  const [notes, setNotes] = useState(order.notes ?? "");
  const [companyId, setCompanyId] = useState(order.company_id ?? "");
  const [contactId, setContactId] = useState(order.contact_id ?? "");
  const [dealId, setDealId] = useState(order.deal_id ?? "");
  const [dueDate, setDueDate] = useState(order.due_date ?? "");
  const [currency, setCurrency] = useState(order.currency);

  const filteredContacts = companyId
    ? contacts.filter((c) => c.company_id === companyId)
    : contacts;

  function handleCompanyChange(val: string) {
    setCompanyId(val);
    if (contactId && val) {
      const still = contacts.find((c) => c.id === contactId && c.company_id === val);
      if (!still) setContactId("");
    }
  }

  function handleSubmit() {
    if (!title.trim()) return;
    startTransition(async () => {
      const ok = await updateOrder(order.id, {
        title: title.trim(),
        notes: notes.trim() || undefined,
        currency,
        due_date: dueDate || null,
        company_id: companyId || null,
        contact_id: contactId || null,
        deal_id: dealId || null,
      });
      if (ok) {
        toast.success(t("orderUpdated"));
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(t("failedToUpdateOrder"));
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>{t("editOrder")}</SheetTitle>
          <SheetDescription>{order.number}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <GunimiField label={t("titleLabel")}>
            <GunimiInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("titlePlaceholder")}
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
          <GunimiButton variant="secondary" disabled={isPending} onClick={() => onOpenChange(false)}>
            {tc("cancel")}
          </GunimiButton>
          <GunimiButton
            variant="primary"
            loading={isPending}
            disabled={!title.trim()}
            onClick={handleSubmit}
          >
            {tc("save")}
          </GunimiButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
