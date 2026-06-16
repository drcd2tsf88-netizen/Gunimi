"use client";

import {
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import DOMPurify
from "dompurify";

import {
  Users,
  Plus,
} from "lucide-react";

import toast
from "react-hot-toast";

import { supabase }
from "@/lib/supabase";

import OrbitCard
from "@/components/ui/OrbitCard";

import OrbitInput
from "@/components/ui/OrbitInput";

import { WorkspaceMember } from "@/types/member";

type Props = {
  members: WorkspaceMember[];

  companyId: string;

  refreshActivity: () => void;
};

export default function WorkspaceMembers({
  members,

  companyId,

  refreshActivity,
}: Props) {
  const [
    inviteEmail,

    setInviteEmail,
  ] = useState("");

  const [
    inviting,

    setInviting,
  ] = useState(false);

  async function inviteMember() {
    if (!inviteEmail) {
      toast.error(
        "Email required"
      );

      return;
    }

    try {
      setInviting(true);

      await supabase
        .from(
          "workspace_invites"
        )
        .insert({
          email: inviteEmail,

          company_id:
            companyId,
        });

      await supabase
        .from(
          "workspace_activity"
        )
        .insert({
          company_id:
            companyId,

          type:
            "member_invited",

          message:
            DOMPurify.sanitize(
              `Invited member: ${inviteEmail}`
            ),
        });

      toast.success(
        "Invitation created"
      );

      setInviteEmail("");

      refreshActivity();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to invite member"
      );
    } finally {
      setInviting(false);
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
            Workspace Team
          </p>

          <h2
            className="
              mt-2

              text-2xl
              font-semibold

              tracking-tight
            "
          >
            Workspace Members
          </h2>

          <p
            className="
              mt-3

              text-sm
              leading-relaxed

              text-zinc-500
            "
          >
            Team collaboration and
            workspace access systems.
          </p>
        </div>

        {/* MEMBERS COUNT */}

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
            {members.length} Members
          </span>
        </div>
      </div>

      {/* INVITE */}

      <OrbitCard
        className="
          p-5
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4

            xl:flex-row
          "
        >
          <OrbitInput
            type="email"
            placeholder="
              Invite member by email
            "
            value={inviteEmail}
            onChange={(e) =>
              setInviteEmail(
                e.target.value
              )
            }
            className="
              flex-1
            "
          />

          <button
            onClick={
              inviteMember
            }
            disabled={inviting}
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

            {inviting
              ? "Inviting..."
              : "Invite Member"}
          </button>
        </div>
      </OrbitCard>

      {/* MEMBERS */}

      <div
        className="
          grid
          gap-4

          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {members.map(
          (member, index) => (
            <motion.div
              key={member.id}
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
                  index * 0.06,
              }}
            >
              <OrbitCard
                className="
                  p-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >
                  {/* AVATAR */}

                  <div
                    className="
                      relative

                      flex
                      h-12
                      w-12

                      shrink-0

                      items-center
                      justify-center

                      rounded-xl

                      border
                      border-white/[0.08]

                      bg-white/[0.03]
                    "
                  >
                    <div
                      className="
                        absolute

                        h-2
                        w-2

                        rounded-full

                        bg-emerald-400
                      "
                    />

                    <div
                      className="
                        absolute

                        h-2
                        w-2

                        animate-ping

                        rounded-full

                        bg-emerald-400/40
                      "
                    />

                    <span
                      className="
                        text-sm
                        font-semibold

                        text-violet-300
                      "
                    >
                      O
                    </span>
                  </div>

                  {/* INFO */}

                  <div>
                    <h3
                      className="
                        text-sm
                        font-medium
                      "
                    >
                      Workspace Member
                    </h3>

                    <p
                      className="
                        mt-1

                        text-xs

                        text-zinc-500
                      "
                    >
                      {member.role}
                    </p>
                  </div>
                </div>
              </OrbitCard>
            </motion.div>
          )
        )}
      </div>
    </section>
  );
}