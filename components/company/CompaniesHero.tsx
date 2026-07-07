"use client";

import { useState }
from "react";

import GunimiSection
from "@/components/layout/GunimiSection";

import GunimiHeading
from "@/components/ui/GunimiHeading";

import GunimiButton
from "@/components/ui/GunimiButton";

import CreateOrganizationModal
from "./CreateOrganizationModal";

import { useTranslations }
from "next-intl";

export default function CompaniesHero() {
  const t =
    useTranslations();

  const [
    open,
    setOpen,
  ] = useState(false);

  return (
    <>
      <GunimiSection>
        <GunimiHeading
          badge={t(
            "companies.organizationIntelligence"
          )}
          title={t(
            "companies.organizations"
          )}
          subtitle={t(
            "companies.organizationsSubtitle"
          )}
        />

        <GunimiButton
          onClick={() => setOpen(true)}
          className="mt-6"
        >
          {t("companies.createOrganization")}
        </GunimiButton>
      </GunimiSection>

      <CreateOrganizationModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
      />
    </>
  );
}
