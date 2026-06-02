"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  motion,
} from "framer-motion";

import {
  UserPlus,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import OrbitInviteModal from "@/components/workspace/OrbitInviteModal";

type Member = {
  id: string;
  role: string;
  profiles?: {
    avatar_url?: string;
    email?: string;
    full_name?: string;
  } | null;
};

export default function OrbitTeamPresence() {
  const [
    members,
    setMembers,
  ] = useState<Member[]>([]);

  const [
    inviteOpen,
    setInviteOpen,
  ] = useState(false);

  const [
    workspaceId,
    setWorkspaceId,
  ] = useState<string>("");

  async function loadMembers() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    const {
      data: myMembership,
    } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq(
        "user_id",
        session.user.id
      )
      .maybeSingle();

    if (!myMembership) return;

    setWorkspaceId(
      myMembership.workspace_id
    );

    const res = await fetch(
      `/api/workspace/members?workspace_id=${myMembership.workspace_id}`
    );

    if (!res.ok) return;

    const {
      members: data,
    } = await res.json();

    setMembers(
      (data || []) as Member[]
    );
  }

  useEffect(() => {
    loadMembers();

    const channel =
      supabase
        .channel(
          "workspace-members"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "workspace_members",
          },
          () => {
            loadMembers();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, []);

  return (
    <>
      <motion.button
        whileHover={{
          y: -2,
        }}
        onClick={() =>
          setInviteOpen(true)
        }
        className="
          group
          flex
          items-center
          gap-4
          rounded-2xl
          border
          border-white/[0.08]
          bg-white/[0.03]
          px-4
          py-2.5
          backdrop-blur-2xl
          transition-all
          duration-300
          hover:border-white/[0.14]
          hover:bg-white/[0.05]
        "
      >
        <div className="flex -space-x-3">
          {members
            .slice(0, 3)
            .map((member) => {
              const profile =
                member.profiles;

              return (
                <div
                  key={member.id}
                  className="
                    relative
                    h-10
                    w-10
                    overflow-hidden
                    rounded-full
                    border-2
                    border-[#050816]
                    bg-violet-500/20
                    ring-1
                    ring-white/[0.06]
                  "
                >
                  {profile?.avatar_url ? (
                    <Image
                      src={
                        profile.avatar_url
                      }
                      alt="Member"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                        text-xs
                        font-semibold
                        text-violet-200
                      "
                    >
                      {profile?.email?.[0]?.toUpperCase() ||
                        "O"}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        <div
          className="
            hidden
            text-left
            lg:block
          "
        >
          <p
            className="
              text-sm
              font-medium
              text-white
            "
          >
            Team Workspace
          </p>

          <p
            className="
              mt-1
              text-xs
              text-zinc-500
            "
          >
            {members.length} active
            members
          </p>
        </div>

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-2xl
            border
            border-violet-500/10
            bg-violet-500/10
            text-violet-200
            transition-all
            duration-300
            group-hover:border-violet-500/20
            group-hover:bg-violet-500/15
          "
        >
          <UserPlus size={16} />
        </div>
      </motion.button>

      <OrbitInviteModal
        open={inviteOpen}
        onClose={() =>
          setInviteOpen(false)
        }
        workspaceId={
          workspaceId
        }
      />
    </>
  );
}