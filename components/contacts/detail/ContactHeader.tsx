"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mail, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import GunimiWorkspaceHeader from "@/components/ui/GunimiWorkspaceHeader";
import type { WorkspaceHealth } from "@/components/ui/GunimiWorkspaceHeader";
import GunimiButton from "@/components/ui/GunimiButton";
import EditContactSheet from "@/components/crm/EditContactSheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { deleteContact } from "@/server/actions/crm/deleteContact";
import type { Contact } from "@/types/contact";
import { MS_PER_DAY } from "@/lib/workspace/constants";

const ACTIVE_THRESHOLD_DAYS = 7;
const ENGAGED_THRESHOLD_DAYS = 30;

function computeContactHealth(
  contact: Contact,
  t: (key: string) => string,
): WorkspaceHealth {
  if (!contact.last_contacted_at) {
    return { level: "at-risk", label: t("healthStatusNeverContacted") };
  }
  const now = Date.now();
  const daysSince = Math.floor(
    (now - new Date(contact.last_contacted_at).getTime()) / MS_PER_DAY,
  );
  if (daysSince <= ACTIVE_THRESHOLD_DAYS) {
    return { level: "healthy", label: t("healthStatusActive") };
  }
  if (daysSince <= ENGAGED_THRESHOLD_DAYS) {
    return { level: "healthy", label: t("healthStatusEngaged") };
  }
  return { level: "warning", label: t("healthStatusNeedsAttention") };
}

function formatLastContacted(
  lastContactedAt: string | null | undefined,
  t: (key: string, params?: Record<string, string | number>) => string,
): string {
  if (!lastContactedAt) return t("headerLastContactedNever");
  const days = Math.floor(
    (Date.now() - new Date(lastContactedAt).getTime()) / MS_PER_DAY,
  );
  if (days === 0) return t("headerLastContactedToday");
  if (days < 7) return t("headerLastContactedDaysAgo", { days });
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return t("headerLastContactedWeeksAgo", { weeks });
  const months = Math.floor(days / 30);
  return t("headerLastContactedMonthsAgo", { months });
}

type Props = {
  contact: Contact;
};

export default function ContactHeader({ contact }: Props) {
  const t = useTranslations("contacts");
  const tc = useTranslations("common");
  const tCrm = useTranslations("crm");

  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  const health = computeContactHealth(contact, t);

  const roleAndCompany =
    contact.position && contact.company_name
      ? `${contact.position} · ${contact.company_name}`
      : (contact.position ?? contact.company_name);

  const lastContacted = formatLastContacted(contact.last_contacted_at, t);

  const contextLine = [roleAndCompany, lastContacted]
    .filter(Boolean)
    .join(" · ");

  function handleDelete() {
    startDelete(async () => {
      const ok = await deleteContact(contact.id);
      if (ok) {
        toast.success(tCrm("contactDeleted"));
        router.push("/dashboard/contacts");
      } else {
        toast.error(tCrm("failedToDeleteContact"));
        setDeleteOpen(false);
      }
    });
  }

  return (
    <>
      <GunimiWorkspaceHeader
        type={t("workspaceType")}
        title={contact.name}
        context={
          contextLine ? (
            <p className="text-sm text-white/40">{contextLine}</p>
          ) : undefined
        }
        owner={contact.owner?.full_name}
        health={health}
        backHref="/dashboard/contacts"
        backLabel={t("backToContacts")}
        actions={
          <div className="flex items-center gap-2">
            {contact.email && (
              <GunimiButton
                variant="secondary"
                className="gap-1.5 px-3 py-2 text-xs"
                onClick={() => {
                  window.location.href = `mailto:${contact.email}`;
                }}
              >
                <Mail size={13} />
                {t("email")}
              </GunimiButton>
            )}

            <GunimiButton
              variant="secondary"
              className="gap-1.5 px-3 py-2 text-xs"
              onClick={() => setEditOpen(true)}
            >
              <Pencil size={13} />
              {tc("edit")}
            </GunimiButton>

            <GunimiButton
              variant="danger"
              className="gap-1.5 px-3 py-2 text-xs"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 size={13} />
              {tc("delete")}
            </GunimiButton>
          </div>
        }
      />

      <EditContactSheet
        key={contact.id}
        contact={contact}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={() => {
          setEditOpen(false);
          router.refresh();
        }}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent showCloseButton={false} className="max-w-md">
          <DialogHeader>
            <DialogTitle>{tCrm("deleteContact")}</DialogTitle>
            <DialogDescription>
              {tCrm("confirmDeleteContact")}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6">
            <GunimiButton
              variant="secondary"
              disabled={isDeleting}
              onClick={() => setDeleteOpen(false)}
            >
              {tc("cancel")}
            </GunimiButton>

            <GunimiButton
              variant="danger"
              loading={isDeleting}
              onClick={handleDelete}
            >
              {tc("delete")}
            </GunimiButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
