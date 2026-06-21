"use client";

import { useEffect, useState, useTransition } from "react";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import { updateCompany } from "@/server/actions/company/updateCompany";

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

import { Company } from "@/types/company";

type Props = {
  company: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

export default function EditCompanySheet({
  company,
  open,
  onOpenChange,
  onSaved,
}: Props) {
  const t = useTranslations("companies");
  const tc = useTranslations("common");

  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(company.name ?? "");
  const [website, setWebsite] = useState(company.website ?? "");
  const [industry, setIndustry] = useState(company.industry ?? "");
  const [country, setCountry] = useState(company.country ?? "");
  const [companySize, setCompanySize] = useState(company.company_size ?? "");
  const [annualValue, setAnnualValue] = useState(
    company.annual_value != null ? String(company.annual_value) : ""
  );

  useEffect(() => {
    if (open) {
      setName(company.name ?? "");
      setWebsite(company.website ?? "");
      setIndustry(company.industry ?? "");
      setCountry(company.country ?? "");
      setCompanySize(company.company_size ?? "");
      setAnnualValue(company.annual_value != null ? String(company.annual_value) : "");
    }
  }, [open, company]);

  function handleClose() {
    onOpenChange(false);
  }

  function handleSave() {
    if (!name.trim()) {
      toast.error(t("organizationName"));
      return;
    }

    startTransition(async () => {
      const result = await updateCompany({
        companyId: company.id,
        name,
        website,
        industry,
        companySize,
        country,
        annualValue: Number(annualValue) || 0,
      });

      if (result) {
        toast.success(t("companyUpdated"));
        onSaved();
        onOpenChange(false);
      } else {
        toast.error(t("failedToUpdateCompany"));
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
          <SheetTitle>{t("editOrganization")}</SheetTitle>
          <SheetDescription>{t("editOrganizationSubtitle")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          <OrbitField label={t("organizationName")}>
            <OrbitInput
              value={name}
              disabled={isPending}
              placeholder={t("organizationName")}
              onChange={(e) => setName(e.target.value)}
            />
          </OrbitField>

          <OrbitField label={t("website")}>
            <OrbitInput
              value={website}
              disabled={isPending}
              placeholder="https://example.com"
              onChange={(e) => setWebsite(e.target.value)}
            />
          </OrbitField>

          <div className="grid grid-cols-2 gap-4">
            <OrbitField label={t("industry")}>
              <OrbitInput
                value={industry}
                disabled={isPending}
                placeholder={t("industry")}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </OrbitField>

            <OrbitField label={t("country")}>
              <OrbitInput
                value={country}
                disabled={isPending}
                placeholder={t("country")}
                onChange={(e) => setCountry(e.target.value)}
              />
            </OrbitField>
          </div>

          <OrbitField label={t("companySize")}>
            <OrbitInput
              value={companySize}
              disabled={isPending}
              placeholder="e.g. 50–200"
              onChange={(e) => setCompanySize(e.target.value)}
            />
          </OrbitField>

          <OrbitField label={t("annualValue")}>
            <OrbitInput
              type="number"
              value={annualValue}
              disabled={isPending}
              placeholder="0"
              onChange={(e) => setAnnualValue(e.target.value)}
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
