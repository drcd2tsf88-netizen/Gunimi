"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Crown, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { mergeContacts } from "@/server/actions/crm/mergeContacts";
import type { MergeContactFieldChoices } from "@/server/actions/crm/mergeContacts";

type Contact = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  companies?: { name: string } | null;
  company_id?: string | null;
};

type ConflictField = keyof MergeContactFieldChoices;

type Props = {
  contacts: [Contact, Contact];
  open: boolean;
  onClose: () => void;
  onMerged: (primaryId: string, deletedId: string) => void;
};

function getConflicts(a: Contact, b: Contact): ConflictField[] {
  const fields: ConflictField[] = ["email", "phone", "position", "company_id"];
  return fields.filter((f) => {
    const aVal = f === "company_id" ? a.companies?.name : a[f as keyof Contact];
    const bVal = f === "company_id" ? b.companies?.name : b[f as keyof Contact];
    return aVal && bVal && aVal !== bVal;
  });
}

function fieldLabel(field: ConflictField, t: (k: string) => string): string {
  const map: Record<ConflictField, string> = {
    email: t("mergeFieldEmail"),
    phone: t("mergeFieldPhone"),
    position: t("mergeFieldPosition"),
    company_id: t("mergeFieldCompany"),
  };
  return map[field];
}

function fieldValue(contact: Contact, field: ConflictField): string {
  if (field === "company_id") return contact.companies?.name ?? "";
  return (contact[field as keyof Contact] as string | null | undefined) ?? "";
}

export default function MergeContactSheet({ contacts, open, onClose, onMerged }: Props) {
  const t = useTranslations("crm");
  const [primaryIdx, setPrimaryIdx] = useState<0 | 1>(0);
  const [fieldChoices, setFieldChoices] = useState<MergeContactFieldChoices>({});
  const [isMerging, startMerge] = useTransition();

  if (!open) return null;

  const [a, b] = contacts;
  const primary = contacts[primaryIdx];
  const secondary = contacts[primaryIdx === 0 ? 1 : 0];
  const conflicts = getConflicts(a, b);

  function handleSwap() {
    setPrimaryIdx((prev) => (prev === 0 ? 1 : 0));
    setFieldChoices({});
  }

  function setChoice(field: ConflictField, winner: "primary" | "secondary") {
    setFieldChoices((prev) => ({ ...prev, [field]: winner }));
  }

  function handleMerge() {
    startMerge(async () => {
      const result = await mergeContacts(primary.id, secondary.id, fieldChoices);
      if (result.success) {
        toast.success(t("mergeSuccess"));
        onMerged(primary.id, secondary.id);
        onClose();
      } else {
        toast.error(t("mergeFailed"));
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-white/[0.06] bg-zinc-950 shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {t("bulkMerge")}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-white/90">{t("mergeTitle")}</p>
            <p className="mt-0.5 text-xs text-white/30">{t("mergeSubtitle")}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/70"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* Side-by-side cards */}
          <div className="grid grid-cols-2 gap-3">
            {contacts.map((contact, idx) => {
              const isPrimary = idx === primaryIdx;
              return (
                <div
                  key={contact.id}
                  className={`rounded-xl border p-4 transition-all ${
                    isPrimary
                      ? "border-violet-500/40 bg-violet-500/10"
                      : "border-white/[0.06] bg-white/[0.02]"
                  }`}
                >
                  {/* Badge */}
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        isPrimary
                          ? "bg-violet-500/20 text-violet-300"
                          : "bg-red-500/10 text-red-400/70"
                      }`}
                    >
                      {isPrimary ? <Crown size={9} /> : <Trash2 size={9} />}
                      {isPrimary ? t("mergePrimary") : t("mergeSecondary")}
                    </span>
                  </div>

                  {/* Avatar + name */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-semibold text-violet-300">
                      {contact.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white/90">{contact.name}</p>
                      {contact.email && (
                        <p className="truncate text-[11px] text-white/35">{contact.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="mt-3 space-y-1">
                    {contact.phone && (
                      <p className="text-[11px] text-white/40">{contact.phone}</p>
                    )}
                    {contact.position && (
                      <p className="text-[11px] text-white/40">{contact.position}</p>
                    )}
                    {contact.companies?.name && (
                      <p className="text-[11px] text-white/40">{contact.companies.name}</p>
                    )}
                  </div>

                  {/* Swap button */}
                  {!isPrimary && (
                    <button
                      onClick={handleSwap}
                      className="mt-3 w-full rounded-lg border border-violet-500/20 py-1.5 text-[11px] text-violet-400 transition-colors hover:bg-violet-500/10"
                    >
                      {t("mergePickPrimary")}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Conflict resolution */}
          {conflicts.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                {t("mergeConflicts")}
              </p>
              {conflicts.map((field) => {
                const primaryVal = fieldValue(primary, field);
                const secondaryVal = fieldValue(secondary, field);
                const choice = fieldChoices[field] ?? "primary";

                return (
                  <div key={field} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="mb-2 text-[11px] text-zinc-500">{fieldLabel(field, t)}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setChoice(field, "primary")}
                        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-left text-xs transition-all ${
                          choice === "primary"
                            ? "border-violet-500/40 bg-violet-500/10 text-violet-200"
                            : "border-white/[0.06] text-white/40 hover:border-white/10"
                        }`}
                      >
                        {choice === "primary" && <CheckCircle2 size={10} className="shrink-0 text-violet-400" />}
                        <span className="truncate">{primaryVal}</span>
                      </button>
                      <button
                        onClick={() => setChoice(field, "secondary")}
                        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-left text-xs transition-all ${
                          choice === "secondary"
                            ? "border-violet-500/40 bg-violet-500/10 text-violet-200"
                            : "border-white/[0.06] text-white/40 hover:border-white/10"
                        }`}
                      >
                        {choice === "secondary" && <CheckCircle2 size={10} className="shrink-0 text-violet-400" />}
                        <span className="truncate">{secondaryVal}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-white/[0.06] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/[0.06] px-4 py-2 text-xs text-white/40 transition-colors hover:border-white/10 hover:text-white/70"
          >
            {t("cancelRule")}
          </button>
          <button
            onClick={handleMerge}
            disabled={isMerging}
            className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isMerging ? t("mergeMerging") : t("mergeConfirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
