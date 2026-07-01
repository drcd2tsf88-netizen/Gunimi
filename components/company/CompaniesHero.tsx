"use client";

import { useState }
from "react";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitButton
from "@/components/ui/OrbitButton";

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
      <OrbitSection>
        <OrbitHeading
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

        <OrbitButton
          onClick={() => setOpen(true)}
          className="mt-6"
        >
          {t("companies.createOrganization")}
        </OrbitButton>
      </OrbitSection>

      <CreateOrganizationModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
      />
    </>
  );
}
