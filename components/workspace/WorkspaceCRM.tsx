"use client";

import {
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  Users,
  Plus,
  Building2,
} from "lucide-react";

import toast
from "react-hot-toast";


import { supabase }
from "@/lib/supabase";

import { ratelimit }
from "@/lib/ratelimit";

import OrbitCard
from "@/components/ui/OrbitCard";

import OrbitInput
from "@/components/ui/OrbitInput";

import OrbitTextarea
from "@/components/ui/OrbitTextarea";

import OrbitEmptyState
from "@/components/ui/OrbitEmptyState";
import getRelativeTime
from "@/lib/utils/getRelativeTime";

type Props = {
  contacts: any[];


  refresh: () => void;

  refreshActivity: () => void;
};

export default function WorkspaceCRM({
  contacts,

  refresh,

  refreshActivity,
}: Props) {
  const [
    name,

    setName,
  ] = useState("");

  const [
    email,

    setEmail,
  ] = useState("");

  const [
    phone,

    setPhone,
  ] = useState("");

  const [
    company,

    setCompany,
  ] = useState("");

  const [
    position,

    setPosition,
  ] = useState("");

  const [
    notes,

    setNotes,
  ] = useState("");

  const [
    creating,

    setCreating,
  ] = useState(false);

  async function createContact() {
    if (!name) {
      toast.error(
        "Contact name required"
      );

      return;
    }

    try {
      setCreating(true);

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        toast.error(
          "Unauthorized"
        );

        return;
      }

      const {
        success,
      } =
        await ratelimit.limit(
          user.id
        );

      if (!success) {
        toast.error(
          "Rate limit exceeded"
        );

        return;
      }

      const response =
        await fetch(
          "/api/crm/create",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name,
              email,
              phone,
              company,
              position,
              notes,
               
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        toast.error(
          data.error ||
            "Failed to create contact"
        );

        return;
      }

      toast.success(
        "Contact created"
      );

      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setPosition("");
      setNotes("");

      refresh();

      refreshActivity();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to create contact"
      );
    } finally {
      setCreating(false);
    }
  }
  function needsFollowUp(
  lastContactedAt?: string
) {
  if (!lastContactedAt) {
    return true;
  }

  const days =
    (
      Date.now() -
      new Date(
        lastContactedAt
      ).getTime()
    ) /
    (1000 * 60 * 60 * 24);

  return days > 30;
}
const followUpContacts =
  contacts.filter((contact) =>
    needsFollowUp(
      contact.last_contacted_at
    )
  );

  return (
    <section
      className="
        space-y-6
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          gap-5

          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >
        <div>
          <p
            className="
              text-[10px]
              uppercase

              tracking-[0.18em]

              text-violet-300
            "
          >
            Relationship Operations
          </p>

          <h2
            className="
              mt-2

              text-2xl
              font-semibold

              tracking-tight
            "
          >
            Relationship Intelligence
          </h2>

          <p
            className="
              mt-3

              text-sm
              leading-relaxed

              text-zinc-500
            "
          >
            Manage relationships,
customers and business
engagement across your workspace.
          </p>
        </div>

        {/* COUNT */}

        <div
          className="
            inline-flex
            items-center
            gap-2

            rounded-full

            border
            border-white/[0.08]

            bg-white/[0.03]

            px-3
            py-2

            text-xs

            backdrop-blur-xl
          "
        >
          <Users
            size={14}
            className="
              text-violet-300
            "
          />

          <span>
            {contacts.length} Relationship
          </span>
        </div>
      </div>
      {/* METRICS */}

<div
  className="
    grid
    gap-4

    md:grid-cols-4
  "
>
  <OrbitCard className="p-4">
    <p className="text-zinc-500">
      Relationships
    </p>

    <h3 className="mt-3 text-3xl font-semibold">
      {contacts.length}
    </h3>
  </OrbitCard>

  <OrbitCard className="p-4">
    <p className="text-zinc-500">
      Qualified
    </p>

    <h3 className="mt-3 text-3xl font-semibold">
      {
        contacts.filter(
          (c) =>
            c.status ===
            "qualified"
        ).length
      }
    </h3>
  </OrbitCard>

  <OrbitCard className="p-4">
    <p className="text-zinc-500">
      Customers
    </p>

    <h3 className="mt-3 text-3xl font-semibold">
      {
        contacts.filter(
          (c) =>
            c.status ===
            "customer"
        ).length
      }
    </h3>
  </OrbitCard>

  <OrbitCard className="p-4">
    <p className="text-zinc-500">
      Inactive
    </p>

    <h3 className="mt-3 text-3xl font-semibold">
      {
        contacts.filter(
          (c) =>
            c.status ===
            "inactive"
        ).length
      }
    </h3>
   
  </OrbitCard>
  <OrbitCard className="p-4">
  <p className="text-zinc-500">
    Needs Follow-Up
  </p>

  <h3 className="mt-3 text-3xl font-semibold">
    {followUpContacts.length}
  </h3>
</OrbitCard>
</div>


      {/* CREATE */}

      <OrbitCard
        className="
          p-5
        "
      >
        <div
          className="
            grid
            gap-4
          "
        >
          <div
            className="
              grid
              gap-4

              xl:grid-cols-2
            "
          >
            <OrbitInput
              type="text"
              placeholder="
                Relationship Name
              "
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />

            <OrbitInput
              type="email"
              placeholder="
                Email
              "
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <OrbitInput
              type="text"
              placeholder="
                Phone
              "
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
            />

            <OrbitInput
              type="text"
              placeholder="
                Organization
              "
              value={company}
              onChange={(e) =>
                setCompany(
                  e.target.value
                )
              }
            />

            <OrbitInput
              type="text"
              placeholder="
                Position
              "
              value={position}
              onChange={(e) =>
                setPosition(
                  e.target.value
                )
              }
              className="
                xl:col-span-2
              "
            />
          </div>

          <OrbitTextarea
            placeholder="
              Relationship notes...
            "
            value={notes}
            onChange={(e) =>
              setNotes(
                e.target.value
              )
            }
          />

          <button
            onClick={
              createContact
            }
            disabled={creating}
            className="
              inline-flex
              items-center
              justify-center
              gap-2

              rounded-xl

              border
              border-violet-500/20

              bg-violet-500/10

              px-5
              py-3

              text-sm
              font-medium

              text-violet-200

              transition-all
              duration-300

              hover:border-violet-500/30
              hover:bg-violet-500/15

              disabled:opacity-50
            "
          >
            <Plus size={16} />

            {creating
              ? "Creating Relationship..."
              : "Add Relationship"}
          </button>
        </div>
      </OrbitCard>

      {/* EMPTY */}

      {contacts.length === 0 && (
        <OrbitEmptyState
          title="
            No Relationships 
          "
          description="
            Orbit Intelligence has not
identified any active business
relationships yet.
          "
          icon={Users}
        />
      )}

      {/* CONTACTS */}

      {contacts.length > 0 && (
        <div
          className="
            grid
            gap-4

            xl:grid-cols-2
          "
        >
          {contacts.map(
            (
              contact,
              index
            ) => (
              <motion.div
                key={contact.id}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.05,
                }}
              >
                <OrbitCard
                  className="
                    h-full

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
                    {/* CONTENT */}

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <h3
                        className="
                          text-lg
                          font-semibold

                          tracking-tight
                        "
                      >
                        {contact.name}
                      </h3>

                      <p
                        className="
                          mt-2

                          text-sm

                          text-zinc-400
                        "
                      >
                        {contact.position}
                        <div
  className={`
    mt-3
    inline-flex
    items-center

    rounded-full

    border

    px-3
    py-1

    text-[10px]
    uppercase

    tracking-[0.18em]

    ${
      contact.status === "customer"
        ? `
          border-emerald-500/20
          bg-emerald-500/10
          text-emerald-300
        `
        : contact.status ===
          "qualified"
        ? `
          border-cyan-500/20
          bg-cyan-500/10
          text-cyan-300
        `
        : contact.status ===
          "inactive"
        ? `
          border-zinc-500/20
          bg-zinc-500/10
          text-zinc-300
        `
        : `
          border-violet-500/20
          bg-violet-500/10
          text-violet-300
        `
    }
  `}
>
  {contact.status}
</div>
                      </p>
                    </div>

                    {/* ICON */}

                    <div
                      className="
                        flex
                        h-10
                        w-10

                        shrink-0

                        items-center
                        justify-center

                        rounded-xl

                        border
                        border-white/[0.08]

                        bg-white/[0.03]
                      "
                    >
                      <Building2
                        size={16}
                        className="
                          text-violet-300
                        "
                      />
                    </div>
                  </div>

                  {/* INFO */}

                  <div
                    className="
                      mt-5

                      space-y-2

                      text-sm

                      text-zinc-400
                    "
                  >
                    {contact.email && (
                      <p>
                        {
                          contact.email
                        }
                      </p>
                    )}

                    {contact.phone && (
                      <p>
                        {
                          contact.phone
                        }
                      </p>
                    )}

                    {contact.company_name && (
                      <p>
                        {
                          contact.company_name
                        }
                      </p>
                    )}
                  </div>

                  {/* NOTES */}

                  {contact.notes && (
                    <p
                      className="
                        mt-5

                        text-sm
                        leading-relaxed

                        text-zinc-500
                      "
                    >
                      {contact.notes}
                      {contact.last_contacted_at && (
  <div
    className="
      mt-4

      text-xs

      text-zinc-500
    "
  >
    Last Contact:
    {" "}
    {getRelativeTime(
      contact.last_contacted_at
    )}
  </div>
)}

                    </p>
                  )}
                </OrbitCard>
              </motion.div>
            )
          )}
        </div>
      )}
    </section>
  );
}