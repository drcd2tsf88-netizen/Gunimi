"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiField from "@/components/ui/GunimiField";
import GunimiInput from "@/components/ui/GunimiInput";
import GunimiTextarea from "@/components/ui/GunimiTextarea";

import { createCompany } from "@/server/actions/company/createCompanies";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateOrganizationModal({ open, onClose }: Props) {
  const t = useTranslations();
  const router = useRouter();

  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [annualValue, setAnnualValue] = useState("");
  const [notes, setNotes] = useState("");

  function reset() {
    setName("");
    setWebsite("");
    setIndustry("");
    setCountry("");
    setAnnualValue("");
    setNotes("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleCreate() {
    if (!name.trim()) return;

    try {
      setCreating(true);

      const company = await createCompany({
        name,
        website,
        industry,
        country,
        annualValue: Number(annualValue) || 0,
        notes,
      });

      if (!company) {
        toast.error(t("companies.createFailed"));
        return;
      }

      toast.success(t("companies.createSuccess"));
      reset();
      onClose();
      router.refresh();
    } catch {
      toast.error(t("companies.createFailed"));
    } finally {
      setCreating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t("companies.createOrganization")}</DialogTitle>
          <DialogDescription>{t("companies.createOrganizationSubtitle")}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid gap-4">
          <GunimiField label={t("companies.organizationName")}>
            <GunimiInput
              placeholder={t("companies.organizationName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </GunimiField>

          <GunimiField label={t("companies.website")}>
            <GunimiInput
              placeholder={t("companies.website")}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </GunimiField>

          <div className="grid gap-4 md:grid-cols-2">
            <GunimiField label={t("companies.industry")}>
              <GunimiInput
                placeholder={t("companies.industry")}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </GunimiField>

            <GunimiField label={t("companies.country")}>
              <GunimiInput
                placeholder={t("companies.country")}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </GunimiField>
          </div>

          <GunimiField label={t("companies.annualValue")}>
            <GunimiInput
              type="number"
              placeholder={t("companies.annualValue")}
              value={annualValue}
              onChange={(e) => setAnnualValue(e.target.value)}
            />
          </GunimiField>

          <GunimiField label={t("companies.notes")}>
            <GunimiTextarea
              placeholder={t("companies.notes")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </GunimiField>
        </div>

        <DialogFooter className="mt-6">
          <GunimiButton variant="secondary" disabled={creating} onClick={handleClose}>
            {t("common.cancel")}
          </GunimiButton>
          <GunimiButton loading={creating} disabled={!name.trim()} onClick={handleCreate}>
            {t("companies.create")}
          </GunimiButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
