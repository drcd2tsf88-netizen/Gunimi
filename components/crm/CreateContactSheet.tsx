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

import OrbitButton from "@/components/ui/OrbitButton";
import OrbitField from "@/components/ui/OrbitField";
import OrbitInput from "@/components/ui/OrbitInput";

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
      toast.error(t("contactNameRequired"));
      return;
    }

    startTransition(async () => {
      const result = await createContact({ name: name.trim(), email, phone });

      if (result) {
        toast.success(t("contactCreated"));
        onCreated(result as CreatedContact);
        handleClose();
      } else {
        toast.error(t("failedToCreateContact"));
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
          <OrbitField label={t("contactName")}>
            <OrbitInput
              value={name}
              disabled={isPending}
              placeholder={t("contactName")}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </OrbitField>

          <OrbitField label={t("contactEmail")}>
            <OrbitInput
              type="email"
              value={email}
              disabled={isPending}
              placeholder="name@company.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </OrbitField>

          <OrbitField label={t("contactPhone")}>
            <OrbitInput
              value={phone}
              disabled={isPending}
              placeholder="+1 555 000 0000"
              onChange={(e) => setPhone(e.target.value)}
            />
          </OrbitField>
        </div>

        <SheetFooter>
          <OrbitButton variant="secondary" disabled={isPending} onClick={handleClose}>
            {tc("cancel")}
          </OrbitButton>
          <OrbitButton loading={isPending} onClick={handleCreate}>
            {t("createContact")}
          </OrbitButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
