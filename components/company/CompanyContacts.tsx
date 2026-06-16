"use client";

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

type Props = {
  contacts: any[];
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
  return (
    <OrbitSection>
      <OrbitHeading
        badge="Relationship Intelligence"
        title="Active Relationships"
        subtitle="
          Customer stakeholders,
          decision makers and
          operational contacts.
        "
      />

      {contacts.length === 0 && (
        <OrbitEmptyState
          title="No relationships"
          description="
            No company contacts
            available yet.
          "
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
                    <h3
                      className="
                        text-lg
                        font-semibold
                      "
                    >
                      {contact.name}
                    </h3>

                    <p
                      className="
                        mt-2

                        text-sm

                        text-white/60
                      "
                    >
                      {
                        contact.position ||
                        "Unknown Position"
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
                    <div
                      className="
                        flex
                        items-center
                        gap-2

                        text-sm
                        text-white/70
                      "
                    >
                      <Mail size={14} />
                      {contact.email}
                    </div>
                  )}

                  {contact.phone && (
                    <div
                      className="
                        flex
                        items-center
                        gap-2

                        text-sm
                        text-white/70
                      "
                    >
                      <Phone size={14} />
                      {contact.phone}
                    </div>
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
                      Relationship Owner
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
                        "Unassigned"
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
                      Last Contact
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
                        : "No activity"}
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