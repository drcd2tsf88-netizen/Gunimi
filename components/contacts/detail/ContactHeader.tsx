"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Mail, Pencil, Phone, Trash2, Building2, Clock, User } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

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
import type { WorkspaceTag } from "@/types/tag";
import { MS_PER_DAY } from "@/lib/workspace/constants";
import TagPicker from "@/components/ui/TagPicker";

const ACTIVE_THRESHOLD_DAYS = 7;
const ENGAGED_THRESHOLD_DAYS = 30;

type HealthLevel = "healthy" | "warning" | "at-risk";

const HEALTH_STYLES: Record<HealthLevel, string> = {
  healthy: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  "at-risk": "border-red-500/20 bg-red-500/10 text-red-300",
};

function computeHealth(contact: Contact, t: (k: string) => string): { level: HealthLevel; label: string } {
  if (!contact.last_contacted_at) return { level: "at-risk", label: t("healthStatusNeverContacted") };
  const days = Math.floor((Date.now() - new Date(contact.last_contacted_at).getTime()) / MS_PER_DAY);
  if (days <= ACTIVE_THRESHOLD_DAYS) return { level: "healthy", label: t("healthStatusActive") };
  if (days <= ENGAGED_THRESHOLD_DAYS) return { level: "healthy", label: t("healthStatusEngaged") };
  return { level: "warning", label: t("healthStatusNeedsAttention") };
}

function contactInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function lastContactText(lastContactedAt: string | undefined, t: (k: string, p?: Record<string, string | number>) => string): string {
  if (!lastContactedAt) return t("lastContactNever");
  const days = Math.floor((Date.now() - new Date(lastContactedAt).getTime()) / MS_PER_DAY);
  if (days === 0) return t("lastContactToday");
  if (days === 1) return t("lastContactYesterday");
  return t("lastContactDaysAgo", { days });
}

type Props = {
  contact: Contact;
  allTags: WorkspaceTag[];
  entityTags: WorkspaceTag[];
};

export default function ContactHeader({ contact, allTags, entityTags }: Props) {
  const t = useTranslations("contacts");
  const tc = useTranslations("common");
  const tCrm = useTranslations("crm");
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  const health = computeHealth(contact, t);

  const subLine = [contact.position, contact.company_name].filter(Boolean).join(" · ");

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
      {/* Back */}
      <Link
        href="/dashboard/contacts"
        className="inline-flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
      >
        <ArrowLeft size={12} />
        {t("backToContacts")}
      </Link>

      {/* Compact identity strip */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#080C14] px-5 py-4 sm:flex-row sm:items-start sm:justify-between">

        {/* Left — avatar + info */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-base font-bold text-violet-300">
            {contactInitials(contact.name)}
          </div>

          {/* Info block */}
          <div className="min-w-0 space-y-1.5">
            {/* Name + health */}
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold leading-tight text-white">
                {contact.name}
              </h1>
              <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", HEALTH_STYLES[health.level])}>
                {health.label}
              </span>
            </div>

            {/* Position · Company */}
            {subLine && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-500">
                {contact.position && <span>{contact.position}</span>}
                {contact.position && contact.company_name && <span>·</span>}
                {contact.company_name && contact.company_id && (
                  <Link
                    href={`/dashboard/companies/${contact.company_id}`}
                    className="flex items-center gap-1 text-zinc-400 transition-colors hover:text-violet-300"
                  >
                    <Building2 size={11} />
                    {contact.company_name}
                  </Link>
                )}
                {contact.company_name && !contact.company_id && (
                  <span className="flex items-center gap-1">
                    <Building2 size={11} />
                    {contact.company_name}
                  </span>
                )}
              </div>
            )}

            {/* Last contact + Owner */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1">
                <Clock size={10} className="text-zinc-600" />
                {t("lastContactLabel")} · {lastContactText(contact.last_contacted_at, t)}
              </span>
              {contact.owner?.full_name && (
                <span className="flex items-center gap-1">
                  <User size={10} className="text-zinc-600" />
                  {contact.owner.full_name}
                </span>
              )}
            </div>

            {/* Contact chips */}
            <div className="flex flex-wrap items-center gap-2">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-1 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-400 transition-colors hover:border-violet-500/30 hover:text-violet-300"
                >
                  <Mail size={10} />
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-1 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-400 transition-colors hover:border-violet-500/30 hover:text-violet-300"
                >
                  <Phone size={10} />
                  {contact.phone}
                </a>
              )}
            </div>

            {/* Tags */}
            <TagPicker
              entityType="contact"
              entityId={contact.id}
              allTags={allTags}
              initialTags={entityTags}
            />
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex shrink-0 items-center gap-2 sm:pt-0.5">
          <GunimiButton
            variant="secondary"
            className="h-8 gap-1.5 px-3 text-xs"
            onClick={() => setEditOpen(true)}
          >
            <Pencil size={12} />
            {tc("edit")}
          </GunimiButton>
          <GunimiButton
            variant="danger"
            className="h-8 gap-1.5 px-3 text-xs"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 size={12} />
            {tc("delete")}
          </GunimiButton>
        </div>
      </div>

      <EditContactSheet
        key={contact.id}
        contact={contact}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={() => { setEditOpen(false); router.refresh(); }}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent showCloseButton={false} className="max-w-md">
          <DialogHeader>
            <DialogTitle>{tCrm("deleteContact")}</DialogTitle>
            <DialogDescription>{tCrm("confirmDeleteContact")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <GunimiButton variant="secondary" disabled={isDeleting} onClick={() => setDeleteOpen(false)}>
              {tc("cancel")}
            </GunimiButton>
            <GunimiButton variant="danger" loading={isDeleting} onClick={handleDelete}>
              {tc("delete")}
            </GunimiButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
