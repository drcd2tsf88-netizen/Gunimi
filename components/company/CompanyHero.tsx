"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import { Pencil, Trash2 } from "lucide-react";

import toast from "react-hot-toast";

import OrbitSection from "@/components/layout/OrbitSection";
import OrbitHeading from "@/components/ui/OrbitHeading";
import OrbitCard from "@/components/ui/OrbitCard";
import OrbitButton from "@/components/ui/OrbitButton";
import EditCompanySheet from "@/components/company/EditCompanySheet";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { deleteCompany } from "@/server/actions/company/deleteCompany";

import { Company } from "@/types/company";

type Props = {
  company: Company;
};

function getStatusStyles(status?: string) {
  switch (status) {
    case "customer":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "partner":
      return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
    case "active":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";
    default:
      return "border-white/10 bg-white/[0.03] text-zinc-300";
  }
}

function getStageStyles(stage?: string) {
  switch (stage) {
    case "customer":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "negotiation":
      return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
    case "proposal":
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
    default:
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";
  }
}

export default function CompanyHero({ company }: Props) {
  const t = useTranslations("companies");
  const tc = useTranslations("common");

  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  function handleDeleted() {
    startDelete(async () => {
      const ok = await deleteCompany(company.id);
      if (ok) {
        toast.success(t("companyDeleted"));
        router.push("/dashboard/companies");
      } else {
        toast.error(t("failedToDeleteCompany"));
        setDeleteOpen(false);
      }
    });
  }

  return (
    <>
      <OrbitSection>
        <OrbitHeading
          badge={t("intelligence")}
          title={company?.name || "Company"}
          subtitle={`${company?.industry || t("unknownIndustry")} • ${company?.country || t("unknownRegion")}`}
        />

        <OrbitCard className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              <div
                className={`inline-flex items-center rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] ${getStatusStyles(company?.status)}`}
              >
                {company?.status}
              </div>

              <div
                className={`inline-flex items-center rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] ${getStageStyles(company?.relationship_stage)}`}
              >
                {company?.relationship_stage}
              </div>
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
                {t("owner")}
              </p>
              <p className="mt-2 text-sm text-white/80">
                {company?.owner?.full_name || t("unassigned")}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                {t("website")}
              </p>
              <p className="mt-2 text-sm text-white/80">
                {company?.website || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                {t("companySize")}
              </p>
              <p className="mt-2 text-sm text-white/80">
                {company?.company_size || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                {t("annualValue")}
              </p>
              <p className="mt-2 text-sm text-white/80">
                €{Number(company?.annual_value || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </OrbitCard>
      </OrbitSection>

      <EditCompanySheet
        company={company}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={() => router.refresh()}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent showCloseButton={false} className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("deleteOrganization")}</DialogTitle>
            <DialogDescription>{t("confirmDeleteOrganization")}</DialogDescription>
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
              onClick={handleDeleted}
            >
              {tc("delete")}
            </OrbitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
