"use client";

import { useState }
from "react";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

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

        <button
          onClick={() =>
            setOpen(true)
          }
          className="
            mt-6

            rounded-xl

            border
            border-violet-500/20

            bg-violet-500/10

            px-4
            py-2

            text-sm
            font-medium

            text-violet-200

            transition-all

            hover:border-violet-500/30
            hover:bg-violet-500/15
          "
        >
          {t(
            "companies.createOrganization"
          )}
        </button>
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
