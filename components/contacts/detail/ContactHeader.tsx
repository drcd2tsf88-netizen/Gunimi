"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mail, Phone, Briefcase, Calendar, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import OrbitSection from "@/components/layout/OrbitSection";
import OrbitHeading from "@/components/ui/OrbitHeading";
import OrbitCard from "@/components/ui/OrbitCard";
import OrbitButton from "@/components/ui/OrbitButton";
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
import { Contact } from "@/types/contact";

type Props = {
  contact: Contact;
};

function getStatusStyles(status?: string) {
  switch (status) {
    case "customer":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "qualified":
      return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
    case "lead":
      return "border-blue-500/20 bg-blue-500/10 text-blue-300";
    default:
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";
  }
}

export default function ContactHeader({ contact }: Props) {
  const t = useTranslations("contacts");
  const tc = useTranslations("common");
  const tCrm = useTranslations("crm");

  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, startDelete] = useTransition();

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
      <OrbitSection>
        <OrbitHeading
          badge={t("badge")}
          title={contact.name}
          subtitle={`${contact.position || t("unknownPosition")}${contact.company_name ? ` • ${contact.company_name}` : ""}`}
        />

        <OrbitCard className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              {contact.status && (
                <div
                  className={`inline-flex items-center rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] ${getStatusStyles(contact.status)}`}
                >
                  {contact.status}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <OrbitButton
                variant="secondary"
                className="gap-1.5 px-3 py-2 text-xs"
                onClick={() => setEditOpen(true)}
              >
                <Pencil size={13} />
                {tc("edit")}
              </OrbitButton>

              <OrbitButton
                variant="danger"
                className="gap-1.5 px-3 py-2 text-xs"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 size={13} />
                {tc("delete")}
              </OrbitButton>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                {t("email")}
              </p>
              {contact.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-2 flex items-center gap-1.5 text-sm text-violet-300 transition-colors hover:text-violet-200"
                >
                  <Mail size={13} />
                  {contact.email}
                </a>
              ) : (
                <p className="mt-2 text-sm text-white/40">—</p>
              )}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                {t("phone")}
              </p>
              {contact.phone ? (
                <a
                  href={`tel:${contact.phone}`}
                  className="mt-2 flex items-center gap-1.5 text-sm text-violet-300 transition-colors hover:text-violet-200"
                >
                  <Phone size={13} />
                  {contact.phone}
                </a>
              ) : (
                <p className="mt-2 text-sm text-white/40">—</p>
              )}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                {t("position")}
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-white/80">
                {contact.position ? (
                  <>
                    <Briefcase size={13} className="text-zinc-500" />
                    {contact.position}
                  </>
                ) : (
                  "—"
                )}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                {t("created")}
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-white/80">
                <Calendar size={13} className="text-zinc-500" />
                {contact.created_at
                  ? new Date(contact.created_at).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>
        </OrbitCard>
      </OrbitSection>

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
            <DialogDescription>{tCrm("confirmDeleteContact")}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6">
            <OrbitButton
              variant="secondary"
              disabled={isDeleting}
              onClick={() => setDeleteOpen(false)}
            >
              {tc("cancel")}
            </OrbitButton>

            <OrbitButton
              variant="danger"
              loading={isDeleting}
              onClick={handleDelete}
            >
              {tc("delete")}
            </OrbitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
