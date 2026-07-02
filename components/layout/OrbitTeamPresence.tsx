"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { motion } from "framer-motion";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { useTranslations } from "next-intl";

import { getWorkspaceMembers } from "@/server/actions/workspace/getWorkspaceMembers";

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
  const t = useTranslations("nav");
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    async function loadMembers() {
      const data = await getWorkspaceMembers();
      setMembers((data as Member[]) ?? []);
    }

    void loadMembers();

    const channel = supabase
      .channel("topbar-workspace-members")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workspace_members" },
        () => { void loadMembers(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <motion.button
      whileHover={{ y: -2 }}
      onClick={() => router.push("/dashboard/settings?section=members")}
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
        {members.slice(0, 3).map((member) => {
          const profile = member.profiles;
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
                  src={profile.avatar_url}
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
                  {profile?.email?.[0]?.toUpperCase() || "O"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden text-left lg:block">
        <p className="text-sm font-medium text-white">{t("teamWorkspace")}</p>
        <p className="mt-1 text-xs text-zinc-500">
          {t("activeMembers", { count: members.length })}
        </p>
      </div>
    </motion.button>
  );
}
