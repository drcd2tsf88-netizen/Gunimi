"use client";

import { useMemo, useState, useTransition } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  FileUp,
  Pencil,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import { getCRMContacts } from "@/server/actions/crm/getCRMContacts";
import { deleteContact } from "@/server/actions/crm/deleteContact";

import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiInput from "@/components/ui/GunimiInput";
import GunimiSection from "@/components/layout/GunimiSection";
import GunimiCard from "@/components/ui/GunimiCard";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";

import CreateContactSheet from "@/components/crm/CreateContactSheet";
import EditContactSheet from "@/components/crm/EditContactSheet";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type Contact = {
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
  initialContacts: Contact[];
};

export default function CRMPageView({ initialContacts }: Props) {
  const t = useTranslations("crm");
  const tc = useTranslations("common");
  const router = useRouter();

  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [isDeleting, startDelete] = useTransition();

  const [prevInitialContacts, setPrevInitialContacts] = useState(initialContacts);

  if (prevInitialContacts !== initialContacts) {
    setPrevInitialContacts(initialContacts);
    setContacts(initialContacts);
  }

  const filtered = useMemo(
    () =>
      search
        ? contacts.filter(
            (c) =>
              c.name?.toLowerCase().includes(search.toLowerCase()) ||
              c.email?.toLowerCase().includes(search.toLowerCase())
          )
        : contacts,
    [contacts, search]
  );

  const leadCount = useMemo(
    () => contacts.filter((c) => c.status === "lead").length,
    [contacts]
  );

  const wonCount = useMemo(
    () => contacts.filter((c) => c.status === "won").length,
    [contacts]
  );

  function handleCreated(contact: Contact) {
    setContacts((prev) => [contact, ...prev]);
  }

  async function handleEditSaved() {
    setEditContact(null);
    const fresh = await getCRMContacts();
    setContacts(fresh as Contact[]);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;

    startDelete(async () => {
      const ok = await deleteContact(deleteTarget.id);

      if (ok) {
        toast.success(t("contactDeleted"));
        setContacts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast.error(t("failedToDeleteContact"));
      }
    });
  }

  return (
    <div className="space-y-8">

      {/* Hero */}
      <GunimiSection>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <GunimiHeading
            badge={t("badge")}
            title={t("title")}
            subtitle={t("subtitle")}
          />

          <GunimiButton
            onClick={() => setCreateOpen(true)}
            className="shrink-0 self-start"
          >
            <UserPlus size={15} />
            {t("createContact")}
          </GunimiButton>
        </div>
      </GunimiSection>

      {/* Search */}
      <GunimiSection>
        <GunimiCard className="p-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-semibold">{t("customerDatabase")}</h2>
              <p className="mt-2 text-zinc-400">{t("searchAndManage")}</p>
            </div>

            <GunimiInput
              type="text"
              placeholder={t("searchCustomers")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="xl:w-96"
            />
          </div>
        </GunimiCard>
      </GunimiSection>

      {/* Stats */}
      <GunimiSection>
        <div className="grid gap-6 lg:grid-cols-3">
          <GunimiCard className="p-6">
            <p className="text-zinc-400">{t("totalCustomers")}</p>
            <h2 className="mt-5 text-4xl font-semibold">{contacts.length}</h2>
          </GunimiCard>

          <GunimiCard className="p-6">
            <p className="text-zinc-400">{t("activeLeads")}</p>
            <h2 className="mt-5 text-4xl font-semibold">{leadCount}</h2>
          </GunimiCard>

          <GunimiCard className="p-6">
            <p className="text-zinc-400">{t("wonDeals")}</p>
            <h2 className="mt-5 text-4xl font-semibold">{wonCount}</h2>
          </GunimiCard>
        </div>
      </GunimiSection>

      {/* Contact list */}
      <GunimiSection>
        <GunimiCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{t("customers")}</h2>
              <p className="mt-2 text-zinc-400">{t("workspaceCrmContacts")}</p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300">
              {filtered.length} {t("results")}
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {contacts.length === 0 ? (
              <GunimiEmptyState
                icon={Users}
                title={t("onboardingEmptyTitle")}
                description={t("onboardingEmptyDescription")}
                action={
                  <div className="flex flex-wrap justify-center gap-3">
                    <GunimiButton onClick={() => setCreateOpen(true)}>
                      <UserPlus size={14} />
                      {t("onboardingCreateContact")}
                    </GunimiButton>

                    <Link href="/dashboard/import">
                      <GunimiButton variant="secondary">
                        <FileUp size={14} />
                        {t("onboardingImportCSV")}
                      </GunimiButton>
                    </Link>
                  </div>
                }
              />
            ) : filtered.length === 0 ? (
              <GunimiEmptyState
                icon={Search}
                title={t("noSearchResults")}
              />
            ) : (
              filtered.map((contact) => (
                <div
                  key={contact.id}
                  role="button"
                  tabIndex={0}
                  className="group relative flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-violet-500/20 hover:bg-violet-500/[0.03] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
                  onClick={() => router.push(`/dashboard/contacts/${contact.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/dashboard/contacts/${contact.id}`);
                    }
                  }}
                >
                  {/* Avatar */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-semibold text-violet-300">
                    {contact.name?.[0]?.toUpperCase() ?? "?"}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white group-hover:text-violet-200 transition-colors">
                      {contact.name}
                    </p>

                    <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
                      {contact.email && (
                        <span className="truncate">{contact.email}</span>
                      )}
                      {contact.email && contact.companies?.name && (
                        <span className="shrink-0">·</span>
                      )}
                      {contact.companies?.name && (
                        <span className="truncate">{contact.companies.name}</span>
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  {contact.status && (
                    <span className="hidden shrink-0 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs capitalize text-zinc-400 sm:block">
                      {contact.status}
                    </span>
                  )}

                  {/* Actions — visible on hover */}
                  <div
                    className="flex shrink-0 items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GunimiButton
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={() => setEditContact(contact)}
                      title={tc("edit")}
                    >
                      <Pencil size={13} />
                    </GunimiButton>

                    <GunimiButton
                      variant="danger"
                      className="h-8 w-8 p-0"
                      onClick={() => setDeleteTarget(contact)}
                      title={tc("delete")}
                    >
                      <Trash2 size={13} />
                    </GunimiButton>
                  </div>
                </div>
              ))
            )}
          </div>
        </GunimiCard>
      </GunimiSection>

      {/* Create sheet */}
      <CreateContactSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={handleCreated}
      />

      {/* Edit sheet */}
      {editContact && (
        <EditContactSheet
          contact={editContact}
          open={!!editContact}
          onOpenChange={(open) => {
            if (!open) setEditContact(null);
          }}
          onSaved={handleEditSaved}
        />
      )}

      {/* Delete dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent showCloseButton={false} className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("deleteContact")}</DialogTitle>
            <DialogDescription>{t("confirmDeleteContact")}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6">
            <GunimiButton
              variant="secondary"
              disabled={isDeleting}
              onClick={() => setDeleteTarget(null)}
            >
              {tc("cancel")}
            </GunimiButton>

            <GunimiButton
              variant="danger"
              loading={isDeleting}
              onClick={handleDeleteConfirm}
            >
              {tc("delete")}
            </GunimiButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
