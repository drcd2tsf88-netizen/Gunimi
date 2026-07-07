"use client";

import { useState, useTransition } from "react";

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

import GunimiButton from "@/components/ui/GunimiButton";
import GunimiField from "@/components/ui/GunimiField";
import GunimiInput from "@/components/ui/GunimiInput";

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

  const [prevOpen, setPrevOpen] = useState(open);
  const [prevCompanyId, setPrevCompanyId] = useState(company.id);

  if (open !== prevOpen || company.id !== prevCompanyId) {
    setPrevOpen(open);
    setPrevCompanyId(company.id);
    if (open) {
      setName(company.name ?? "");
      setWebsite(company.website ?? "");
      setIndustry(company.industry ?? "");
      setCountry(company.country ?? "");
      setCompanySize(company.company_size ?? "");
      setAnnualValue(company.annual_value != null ? String(company.annual_value) : "");
    }
  }

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
          <GunimiField label={t("organizationName")}>
            <GunimiInput
              value={name}
              disabled={isPending}
              placeholder={t("organizationName")}
              onChange={(e) => setName(e.target.value)}
            />
          </GunimiField>

          <GunimiField label={t("website")}>
            <GunimiInput
              value={website}
              disabled={isPending}
              placeholder="https://example.com"
              onChange={(e) => setWebsite(e.target.value)}
            />
          </GunimiField>

          <div className="grid grid-cols-2 gap-4">
            <GunimiField label={t("industry")}>
              <GunimiInput
                value={industry}
                disabled={isPending}
                placeholder={t("industry")}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </GunimiField>

            <GunimiField label={t("country")}>
              <GunimiInput
                value={country}
                disabled={isPending}
                placeholder={t("country")}
                onChange={(e) => setCountry(e.target.value)}
              />
            </GunimiField>
          </div>

          <GunimiField label={t("companySize")}>
            <GunimiInput
              value={companySize}
              disabled={isPending}
              placeholder="e.g. 50–200"
              onChange={(e) => setCompanySize(e.target.value)}
            />
          </GunimiField>

          <GunimiField label={t("annualValue")}>
            <GunimiInput
              type="number"
              value={annualValue}
              disabled={isPending}
              placeholder="0"
              onChange={(e) => setAnnualValue(e.target.value)}
            />
          </GunimiField>
        </div>

        <SheetFooter>
          <GunimiButton variant="secondary" disabled={isPending} onClick={handleClose}>
            {tc("cancel")}
          </GunimiButton>
          <GunimiButton loading={isPending} onClick={handleSave}>
            {tc("save")}
          </GunimiButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
