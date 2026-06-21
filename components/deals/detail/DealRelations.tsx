"use client";

import Link
from "next/link";

import {
  Building2,
  User,
  Briefcase,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import OrbitCard
from "@/components/ui/OrbitCard";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitEmptyState
from "@/components/ui/OrbitEmptyState";

import { Deal } from "@/types/deal";

type Props = {
  deal: Deal;
};

export default function DealRelations({
  deal,
}: Props) {
  const t =
    useTranslations(
      "deals"
    );

  const hasRelations =
    deal.company ||
    deal.contact ||
    deal.owner;

  return (
    <OrbitCard
      className="
        p-6
      "
    >
      <OrbitHeading
        title={t(
          "relationships"
        )}
      />

      {!hasRelations && (
        <div
          className="
            mt-6
          "
        >
          <OrbitEmptyState
            title={t(
              "noRelationships"
            )}
            description={t(
              "noRelationshipsDescription"
            )}
            icon={Briefcase}
          />
        </div>
      )}

      {hasRelations && (
        <div
          className="
            mt-6
            space-y-4
          "
        >
          {deal.company && (
            <Link
              href={`/dashboard/companies/${deal.company.id}`}
            >
              <div
                className="
                  group

                  rounded-xl

                  border
                  border-white/[0.08]

                  bg-white/[0.02]

                  p-4

                  transition-all

                  hover:border-violet-500/20
                  hover:bg-white/[0.04]
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <Building2
                    size={14}
                  />

                  <span
                    className="
                      text-xs
                      text-white/50
                    "
                  >
                    {t(
                      "organization"
                    )}
                  </span>
                </div>

                <p
                  className="
                    mt-2

                    text-sm
                    font-medium
                  "
                >
                  {
                    deal.company
                      .name
                  }
                </p>
              </div>
            </Link>
          )}

          {deal.contact && (
            <Link
              href="/dashboard/crm"
            >
              <div
                className="
                  group

                  rounded-xl

                  border
                  border-white/[0.08]

                  bg-white/[0.02]

                  p-4

                  transition-all

                  hover:border-violet-500/20
                  hover:bg-white/[0.04]
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <User
                    size={14}
                  />

                  <span
                    className="
                      text-xs
                      text-white/50
                    "
                  >
                    {t(
                      "contact"
                    )}
                  </span>
                </div>

                <p
                  className="
                    mt-2

                    text-sm
                    font-medium
                  "
                >
                  {
                    deal.contact
                      .name
                  }
                </p>

                {deal.contact
                  ?.email && (
                  <p
                    className="
                      mt-1

                      text-xs
                      text-white/50
                    "
                  >
                    {
                      deal.contact
                        .email
                    }
                  </p>
                )}
              </div>
            </Link>
          )}

          {deal.owner && (
            <div
              className="
                rounded-xl

                border
                border-white/[0.08]

                bg-white/[0.02]

                p-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Briefcase
                  size={14}
                />

                <span
                  className="
                    text-xs
                    text-white/50
                  "
                >
                  {t(
                    "owner"
                  )}
                </span>
              </div>

              <p
                className="
                  mt-2

                  text-sm
                  font-medium
                "
              >
                {
                  deal.owner
                    .full_name
                }
              </p>
            </div>
          )}
        </div>
      )}
    </OrbitCard>
  );
}