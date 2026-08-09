"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Search, User } from "lucide-react";

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
import { validatePhone } from "@/lib/utils/validatePhone";

import { createContact } from "@/server/actions/crm/createContact";
import { linkContactToCompany } from "@/server/actions/company/linkContactToCompany";
import { getContacts } from "@/server/actions/crm/getContacts";

type WorkspaceContact = {
  id: string;
  name: string;
  email?: string | null;
  company_id?: string | null;
};

type Props = {
  companyId: string;
  companyName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded: () => void;
};

type Mode = "new" | "link";

export default function AddContactToCompanySheet({
  companyId,
  companyName,
  open,
  onOpenChange,
  onAdded,
}: Props) {
  const t = useTranslations("companies");
  const tc = useTranslations("common");
  const tcrm = useTranslations("crm");

  const [mode, setMode] = useState<Mode>("new");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<WorkspaceContact[]>([]);
  const [contactsLoaded, setContactsLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setName("");
    setEmail("");
    setPhone("");
    setPhoneError(false);
    setSearch("");
    setMode("new");
    setContacts([]);
    setContactsLoaded(false);
  }

  function handleClose() {
    reset();
    onOpenChange(false);
  }

  function handleModeSwitch(next: Mode) {
    setMode(next);
    if (next === "link" && !contactsLoaded) {
      startTransition(async () => {
        const all = await getContacts();
        setContacts(
          (all as WorkspaceContact[]).filter(
            (c) => !c.company_id || c.company_id === companyId
          )
        );
        setContactsLoaded(true);
      });
    }
  }

  function handleCreate() {
    if (!name.trim()) {
      toast.error(tcrm("contactNameRequired"), { id: "add-contact-company" });
      return;
    }
    if (!validatePhone(phone)) {
      setPhoneError(true);
      return;
    }
    toast.loading(tcrm("creatingContact"), { id: "add-contact-company" });
    startTransition(async () => {
      const result = await createContact({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        companyId,
        companyName,
      });
      if (result) {
        toast.success(t("contactAdded"), { id: "add-contact-company" });
        onAdded();
        handleClose();
      } else {
        toast.error(t("contactAddFailed"), { id: "add-contact-company" });
      }
    });
  }

  function handleLink(contact: WorkspaceContact) {
    toast.loading(t("contactLinking"), { id: "add-contact-company" });
    startTransition(async () => {
      const result = await linkContactToCompany({
        contactId: contact.id,
        companyId,
        companyName,
      });
      if (result) {
        toast.success(t("contactLinked"), { id: "add-contact-company" });
        onAdded();
        handleClose();
      } else {
        toast.error(t("contactLinkFailed"), { id: "add-contact-company" });
      }
    });
  }

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

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
          <SheetTitle>{t("addContactTitle")}</SheetTitle>
          <SheetDescription>{t("addContactSubtitle")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Mode toggle */}
          <div className="flex gap-1 rounded-lg bg-white/[0.04] p-1">
            {(["new", "link"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => handleModeSwitch(m)}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === m
                    ? "bg-white/[0.08] text-white/90"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {m === "new" ? t("addContactModeNew") : t("addContactModeLink")}
              </button>
            ))}
          </div>

          {mode === "new" && (
            <div className="space-y-4">
              <GunimiField label={tcrm("contactName")}>
                <GunimiInput
                  value={name}
                  disabled={isPending}
                  placeholder={tcrm("contactName")}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
                  autoFocus
                />
              </GunimiField>

              <GunimiField label={tcrm("contactEmail")}>
                <GunimiInput
                  type="email"
                  value={email}
                  disabled={isPending}
                  placeholder={tcrm("contactEmailPlaceholder")}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </GunimiField>

              <GunimiField label={tcrm("contactPhone")} error={phoneError ? tcrm("phoneInvalid") : undefined}>
                <GunimiInput
                  value={phone}
                  disabled={isPending}
                  placeholder={tcrm("contactPhonePlaceholder")}
                  onChange={(e) => { setPhone(e.target.value); if (phoneError) setPhoneError(!validatePhone(e.target.value)); }}
                  onBlur={(e) => { if (e.target.value) setPhoneError(!validatePhone(e.target.value)); }}
                />
              </GunimiField>
            </div>
          )}

          {mode === "link" && (
            <div className="space-y-3">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" aria-hidden />
                <GunimiInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("searchContacts")}
                  className="pl-8"
                />
              </div>

              {isPending && !contactsLoaded ? (
                <p className="py-4 text-center text-xs text-white/30">{tc("loading")}</p>
              ) : filtered.length === 0 ? (
                <p className="py-4 text-center text-xs text-white/30">{t("noContactsToLink")}</p>
              ) : (
                <div className="divide-y divide-white/[0.04] rounded-lg border border-white/[0.06] overflow-hidden">
                  {filtered.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => handleLink(contact)}
                      disabled={isPending}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors disabled:opacity-50"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                        <User size={12} className="text-white/40" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white/80">{contact.name}</p>
                        {contact.email && (
                          <p className="truncate text-xs text-white/35">{contact.email}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {mode === "new" && (
          <SheetFooter>
            <GunimiButton variant="secondary" disabled={isPending} onClick={handleClose}>
              {tc("cancel")}
            </GunimiButton>
            <GunimiButton loading={isPending} disabled={!name.trim() || isPending} onClick={handleCreate}>
              {t("addContactCreate")}
            </GunimiButton>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
