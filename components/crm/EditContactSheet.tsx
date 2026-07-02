"use client";

import { useState, useTransition } from "react";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import { updateContact } from "@/server/actions/crm/updateContact";

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
import OrbitTextarea from "@/components/ui/OrbitTextarea";

type Contact = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  notes?: string | null;
};

type Props = {
  contact: Contact;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

export default function EditContactSheet({
  contact,
  open,
  onOpenChange,
  onSaved,
}: Props) {
  const t = useTranslations("crm");
  const tc = useTranslations("common");

  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(contact.name ?? "");
  const [email, setEmail] = useState(contact.email ?? "");
  const [phone, setPhone] = useState(contact.phone ?? "");
  const [position, setPosition] = useState(contact.position ?? "");
  const [notes, setNotes] = useState(contact.notes ?? "");

  const [prevOpen, setPrevOpen] = useState(open);
  const [prevContactId, setPrevContactId] = useState(contact.id);

  if (open !== prevOpen || contact.id !== prevContactId) {
    setPrevOpen(open);
    setPrevContactId(contact.id);
    if (open) {
      setName(contact.name ?? "");
      setEmail(contact.email ?? "");
      setPhone(contact.phone ?? "");
      setPosition(contact.position ?? "");
      setNotes(contact.notes ?? "");
    }
  }

  function handleClose() {
    onOpenChange(false);
  }

  function handleSave() {
    if (!name.trim()) {
      toast.error(t("contactNameRequired"));
      return;
    }

    startTransition(async () => {
      const result = await updateContact({
        contactId: contact.id,
        name,
        email,
        phone,
        position,
        notes,
      });

      if (result) {
        toast.success(t("contactUpdated"));
        onSaved();
        onOpenChange(false);
      } else {
        toast.error(t("failedToUpdateContact"));
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
          <SheetTitle>{t("editContact")}</SheetTitle>
          <SheetDescription>{t("editContactSubtitle")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          <OrbitField label={t("contactName")}>
            <OrbitInput
              value={name}
              disabled={isPending}
              placeholder={t("contactName")}
              onChange={(e) => setName(e.target.value)}
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

          <OrbitField label={t("contactPosition")}>
            <OrbitInput
              value={position}
              disabled={isPending}
              placeholder={t("contactPosition")}
              onChange={(e) => setPosition(e.target.value)}
            />
          </OrbitField>

          <OrbitField label={t("contactNotes")}>
            <OrbitTextarea
              value={notes}
              disabled={isPending}
              placeholder={t("contactNotes")}
              onChange={(e) => setNotes(e.target.value)}
            />
          </OrbitField>
        </div>

        <SheetFooter>
          <OrbitButton variant="secondary" disabled={isPending} onClick={handleClose}>
            {tc("cancel")}
          </OrbitButton>
          <OrbitButton loading={isPending} onClick={handleSave}>
            {tc("save")}
          </OrbitButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
