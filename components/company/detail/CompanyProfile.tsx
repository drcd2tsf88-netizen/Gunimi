"use client";

import { Globe, Building2, MapPin, Users2, DollarSign, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import GunimiSection from "@/components/layout/GunimiSection";
import GunimiCard from "@/components/ui/GunimiCard";
import { formatCurrency } from "@/lib/utils/formatCurrency";

import type { Company } from "@/types/company";

type Props = {
  company: Company;
};

type FieldItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
};

export default function CompanyProfile({ company }: Props) {
  const t = useTranslations("companies");

  const fields: FieldItem[] = [];

  if (company.website) {
    fields.push({
      icon: Globe,
      label: t("profileWebsite"),
      value: company.website,
      href: company.website.startsWith("http")
        ? company.website
        : `https://${company.website}`,
    });
  }
  if (company.industry) {
    fields.push({ icon: Building2, label: t("profileIndustry"), value: company.industry });
  }
  if (company.country) {
    fields.push({ icon: MapPin, label: t("profileCountry"), value: company.country });
  }
  if (company.company_size) {
    fields.push({ icon: Users2, label: t("profileCompanySize"), value: company.company_size });
  }
  if (company.annual_value) {
    fields.push({
      icon: DollarSign,
      label: t("profileAnnualValue"),
      value: formatCurrency(Number(company.annual_value)),
    });
  }

  if (fields.length === 0) return null;

  return (
    <GunimiSection>
      <GunimiCard className="p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-white/30">
          {t("profileSectionTitle")}
        </p>
        <div className="space-y-3">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.label} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-white/30">
                  <Icon size={12} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-white/30">
                    {field.label}
                  </p>
                  {field.href ? (
                    <a
                      href={field.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-sm text-violet-300 transition-colors hover:text-violet-200"
                    >
                      {field.value}
                    </a>
                  ) : (
                    <p className="truncate text-sm text-white/70">{field.value}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </GunimiCard>
    </GunimiSection>
  );
}
