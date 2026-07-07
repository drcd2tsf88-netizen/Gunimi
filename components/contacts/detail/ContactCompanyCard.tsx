"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Building2, ArrowRight } from "lucide-react";
import GunimiSection from "@/components/layout/GunimiSection";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiCard from "@/components/ui/GunimiCard";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import { Contact } from "@/types/contact";

type Props = {
  contact: Contact;
};

export default function ContactCompanyCard({ contact }: Props) {
  const t = useTranslations("contacts");

  return (
    <GunimiSection>
      <GunimiHeading
        badge={t("companyBadge")}
        title={t("companyRelation")}
        subtitle={t("companyRelationSubtitle")}
      />

      {!contact.company_id ? (
        <GunimiEmptyState
          title={t("noCompany")}
          description={t("noCompanyDescription")}
          icon={Building2}
        />
      ) : (
        <Link
          href={`/dashboard/companies/${contact.company_id}`}
          className="mt-6 block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
        >
          <GunimiCard className="p-5 transition-all hover:border-violet-500/20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                  <Building2 size={18} className="text-violet-300" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    {t("organization")}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-white">
                    {contact.company_name || t("unknownCompany")}
                  </p>
                </div>
              </div>
              <ArrowRight size={16} className="shrink-0 text-white/30" />
            </div>
          </GunimiCard>
        </Link>
      )}
    </GunimiSection>
  );
}
