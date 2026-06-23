"use client";

import Link from "next/link";

import { useTranslations } from "next-intl";

import {
  Users,
  Mail,
  Phone,
} from "lucide-react";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitCard
from "@/components/ui/OrbitCard";

import OrbitEmptyState
from "@/components/ui/OrbitEmptyState";

import getRelativeTime
from "@/lib/utils/getRelativeTime";

import { Contact } from "@/types/contact";

type Props = {
  contacts: Contact[];
};

function getStatusStyles(
  status?: string
) {
  switch (status) {
    case "customer":
      return `
        border-emerald-500/20
        bg-emerald-500/10
        text-emerald-300
      `;

    case "qualified":
      return `
        border-cyan-500/20
        bg-cyan-500/10
        text-cyan-300
      `;

    default:
      return `
        border-violet-500/20
        bg-violet-500/10
        text-violet-300
      `;
  }
}

export default function CompanyContacts({
  contacts,
}: Props) {
  const t = useTranslations("companies");

  return (
    <OrbitSection>
      <OrbitHeading
        badge={t("relationshipIntelligence")}
        title={t("activeRelationships")}
        subtitle={t("contactsSubtitle")}
      />

      {contacts.length === 0 && (
        <OrbitEmptyState
          title={t("noRelationships")}
          description={t("noRelationshipsDescription")}
          icon={Users}
        />
      )}

      {contacts.length > 0 && (
        <div
          className="
            mt-6

            grid
            gap-4

            xl:grid-cols-2
          "
        >
          {contacts.map(
            (contact) => (
              <OrbitCard
                key={contact.id}
                className="
                  p-5
                "
              >
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <Link
                      href={`/dashboard/crm/${contact.id}`}
                      className="
                        text-lg
                        font-semibold
                        hover:text-violet-300
                        transition-colors
                        focus-visible:outline-none
                        focus-visible:underline
                      "
                    >
                      {contact.name}
                    </Link>

                    <p
                      className="
                        mt-2

                        text-sm

                        text-white/60
                      "
                    >
                      {
                        contact.position ||
                        t("unknownPosition")
                      }
                    </p>
                  </div>

                  <div
                    className={`
                      rounded-full
                      border

                      px-3
                      py-1

                      text-xs

                      ${getStatusStyles(
                        contact.status
                      )}
                    `}
                  >
                    {contact.status}
                  </div>
                </div>

                <div
                  className="
                    mt-5
                    space-y-3
                  "
                >
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="
                        flex
                        items-center
                        gap-2

                        text-sm
                        text-white/70

                        transition
                        hover:text-violet-300
                      "
                    >
                      <Mail size={14} />
                      {contact.email}
                    </a>
                  )}

                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="
                        flex
                        items-center
                        gap-2

                        text-sm
                        text-white/70

                        transition
                        hover:text-violet-300
                      "
                    >
                      <Phone size={14} />
                      {contact.phone}
                    </a>
                  )}
                </div>

                <div
                  className="
                    mt-5

                    grid
                    gap-4

                    md:grid-cols-2
                  "
                >
                  <div>
                    <p
                      className="
                        text-xs
                        text-white/40
                      "
                    >
                      {t("relationshipOwner")}
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                      "
                    >
                      {
                        contact.owner
                          ?.full_name ||
                        t("unassigned")
                      }
                    </p>
                  </div>

                  <div>
                    <p
                      className="
                        text-xs
                        text-white/40
                      "
                    >
                      {t("lastContact")}
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                      "
                    >
                      {contact.last_contacted_at
                        ? getRelativeTime(
                            contact.last_contacted_at
                          )
                        : t("noActivity")}
                    </p>
                  </div>
                </div>

                {contact.notes && (
                  <p
                    className="
                      mt-5

                      text-sm
                      leading-relaxed

                      text-white/50
                    "
                  >
                    {contact.notes}
                  </p>
                )}
              </OrbitCard>
            )
          )}
        </div>
      )}
    </OrbitSection>
  );
}
