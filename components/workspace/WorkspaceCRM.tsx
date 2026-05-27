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

import DOMPurify
from "dompurify";

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

type Props = {
  contacts: any[];

  companyId: string;

  refresh: () => void;

  refreshActivity: () => void;
};

export default function WorkspaceCRM({
  contacts,

  companyId,

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

      const cleanName =
        DOMPurify.sanitize(
          name
        );

      const cleanEmail =
        DOMPurify.sanitize(
          email
        );

      const cleanPhone =
        DOMPurify.sanitize(
          phone
        );

      const cleanCompany =
        DOMPurify.sanitize(
          company
        );

      const cleanPosition =
        DOMPurify.sanitize(
          position
        );

      const cleanNotes =
        DOMPurify.sanitize(
          notes
        );

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
              companyId,

              name:
                cleanName,

              email:
                cleanEmail,

              phone:
                cleanPhone,

              company:
                cleanCompany,

              position:
                cleanPosition,

              notes:
                cleanNotes,
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
            Customer Intelligence
          </p>

          <h2
            className="
              mt-2

              text-2xl
              font-semibold

              tracking-tight
            "
          >
            CRM Contacts
          </h2>

          <p
            className="
              mt-3

              text-sm
              leading-relaxed

              text-zinc-500
            "
          >
            Manage customer
            relationships and
            operational CRM workflows.
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
            {contacts.length} Contacts
          </span>
        </div>
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
                Full name
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
                Company
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
              CRM notes...
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
              ? "Creating..."
              : "Create Contact"}
          </button>
        </div>
      </OrbitCard>

      {/* EMPTY */}

      {contacts.length === 0 && (
        <OrbitEmptyState
          title="
            No CRM contacts
          "
          description="
            Orbit AI has not detected
            any active customer
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