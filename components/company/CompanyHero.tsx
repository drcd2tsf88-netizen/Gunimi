"use client";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitCard
from "@/components/ui/OrbitCard";

import { Company } from "@/types/company";

type Props = {
  company: Company;
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

    case "partner":
      return `
        border-cyan-500/20
        bg-cyan-500/10
        text-cyan-300
      `;

    case "active":
      return `
        border-violet-500/20
        bg-violet-500/10
        text-violet-300
      `;

    default:
      return `
        border-white/10
        bg-white/[0.03]
        text-zinc-300
      `;
  }
}

function getStageStyles(
  stage?: string
) {
  switch (stage) {
    case "customer":
      return `
        border-emerald-500/20
        bg-emerald-500/10
        text-emerald-300
      `;

    case "negotiation":
      return `
        border-cyan-500/20
        bg-cyan-500/10
        text-cyan-300
      `;

    case "proposal":
      return `
        border-yellow-500/20
        bg-yellow-500/10
        text-yellow-300
      `;

    default:
      return `
        border-violet-500/20
        bg-violet-500/10
        text-violet-300
      `;
  }
}

export default function CompanyHero({
  company,
}: Props) {
  return (
    <OrbitSection>
      <OrbitHeading
        badge="Company Intelligence"
        title={
          company?.name ||
          "Company"
        }
        subtitle={`
          ${company?.industry || "Unknown Industry"}
          •
          ${company?.country || "Unknown Region"}
        `}
      />

      <OrbitCard
        className="
          p-6
        "
      >
        <div
          className="
            flex
            flex-wrap
            gap-3
          "
        >
          <div
            className={`
              inline-flex
              items-center

              rounded-full
              border

              px-4
              py-2

              text-xs
              uppercase

              tracking-[0.18em]

              ${getStatusStyles(
                company?.status
              )}
            `}
          >
            {company?.status}
          </div>

          <div
            className={`
              inline-flex
              items-center

              rounded-full
              border

              px-4
              py-2

              text-xs
              uppercase

              tracking-[0.18em]

              ${getStageStyles(
                company?.relationship_stage
              )}
            `}
          >
            {
              company?.relationship_stage
            }
          </div>
        </div>

        <div
          className="
            mt-6

            grid
            gap-4

            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          <div>
            <p
              className="
                text-xs
                uppercase

                tracking-[0.18em]

                text-zinc-500
              "
            >
              Owner
            </p>

            <p
              className="
                mt-2

                text-sm

                text-white/80
              "
            >
              {
                company?.owner
                  ?.full_name ||
                "Unassigned"
              }
            </p>
          </div>

          <div>
            <p
              className="
                text-xs
                uppercase

                tracking-[0.18em]

                text-zinc-500
              "
            >
              Website
            </p>

            <p
              className="
                mt-2

                text-sm

                text-white/80
              "
            >
              {
                company?.website ||
                "-"
              }
            </p>
          </div>

          <div>
            <p
              className="
                text-xs
                uppercase

                tracking-[0.18em]

                text-zinc-500
              "
            >
              Company Size
            </p>

            <p
              className="
                mt-2

                text-sm

                text-white/80
              "
            >
              {
                company?.company_size ||
                "-"
              }
            </p>
          </div>

          <div>
            <p
              className="
                text-xs
                uppercase

                tracking-[0.18em]

                text-zinc-500
              "
            >
              Annual Value
            </p>

            <p
              className="
                mt-2

                text-sm

                text-white/80
              "
            >
              €
              {Number(
                company?.annual_value ||
                0
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </OrbitCard>
    </OrbitSection>
  );
}