"use client";

import { useState, useTransition } from "react";

import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import { createContact } from "@/server/actions/crm/createContact";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";

import GunimiButton from "@/components/ui/GunimiButton";
import GunimiField from "@/components/ui/GunimiField";
import GunimiInput from "@/components/ui/GunimiInput";

type CreatedContact = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  notes?: string | null;
  status?: string | null;
  company_id?: string | null;
  companies?: { name: string } | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (contact: CreatedContact) => void;
};

export default function CreateContactSheet({
  open,
  onOpenChange,
  onCreated,
}: Props) {
  const t = useTranslations("crm");
  const tc = useTranslations("common");

  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function reset() {
    setName("");
    setEmail("");
    setPhone("");
  }

  function handleClose() {
    reset();
    onOpenChange(false);
  }

  function handleCreate() {
    if (!name.trim()) {
      toast.error(t("contactNameRequired"), { id: "orbit-contact-create" });
      return;
    }

    toast.loading(t("creatingContact"), { id: "orbit-contact-create" });

    startTransition(async () => {
      const result = await createContact({ name: name.trim(), email, phone });

      if (result) {
        toast.success(t("contactCreated"), { id: "orbit-contact-create" });
        onCreated(result as CreatedContact);
        handleClose();
      } else {
        toast.error(t("failedToCreateContact"), { id: "orbit-contact-create" });
      }
    });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose();
        else onOpenChange(next);
      }}
    >
      <SheetContent className="max-w-md">
        <SheetHeader>
          <SheetTitle>{t("createContact")}</SheetTitle>
          <SheetDescription>{t("createContactSubtitle")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          <GunimiField label={t("contactName")}>
            <GunimiInput
              value={name}
              disabled={isPending}
              placeholder={t("contactName")}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </GunimiField>

          <GunimiField label={t("contactEmail")}>
            <GunimiInput
              type="email"
              value={email}
              disabled={isPending}
              placeholder={t("contactEmailPlaceholder")}
              onChange={(e) => setEmail(e.target.value)}
            />
          </GunimiField>

          <GunimiField label={t("contactPhone")}>
            <GunimiInput
              value={phone}
              disabled={isPending}
              placeholder={t("contactPhonePlaceholder")}
              onChange={(e) => setPhone(e.target.value)}
            />
          </GunimiField>
        </div>

        <SheetFooter>
          <GunimiButton variant="secondary" disabled={isPending} onClick={handleClose}>
            {tc("cancel")}
          </GunimiButton>
          <GunimiButton loading={isPending} onClick={handleCreate}>
            {t("createContact")}
          </GunimiButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
