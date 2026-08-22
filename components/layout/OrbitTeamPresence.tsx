"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { UserPlus, Crown, Shield } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { getWorkspaceMembers } from "@/server/actions/workspace/getWorkspaceMembers";
import { createWorkspaceInvite } from "@/server/actions/workspace/createWorkspaceInvite";
import { useIsHydrated } from "@/lib/hooks/useIsHydrated";

type Member = {
  id: string;
  role: string;
  user_id: string;
  profiles?: {
    avatar_url?: string | null;
    email?: string | null;
    full_name?: string | null;
  } | null;
};

function memberInitials(member: Member): string {
  const name = member.profiles?.full_name || member.profiles?.email || "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function RoleBadge({ role, t }: { role: string; t: (k: string) => string }) {
  if (role === "owner") return (
    <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-amber-400/80">
      <Crown size={9} /> {t("teamRoleOwner")}
    </span>
  );
  if (role === "admin") return (
    <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-violet-400/80">
      <Shield size={9} /> {t("teamRoleAdmin")}
    </span>
  );
  return <span className="text-[9px] text-zinc-600">{t("teamRoleMember")}</span>;
}

export default function OrbitTeamPresence() {
  const t = useTranslations("nav");
  const mounted = useIsHydrated();
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      const [data, auth] = await Promise.all([
        getWorkspaceMembers(),
        supabase.auth.getUser(),
      ]);
      setMembers((data as Member[]) ?? []);
      setCurrentUserId(auth.data.user?.id ?? null);
    }
    void init();

    const channel = supabase
      .channel("topbar-workspace-members")
      .on("postgres_changes", { event: "*", schema: "public", table: "workspace_members" }, () => {
        getWorkspaceMembers().then((data) => setMembers((data as Member[]) ?? []));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function handleToggle() {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPopupPos({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    setOpen((v) => !v);
  }

  const currentMember = members.find((m) => m.user_id === currentUserId);
  const canInvite = currentMember?.role === "owner" || currentMember?.role === "admin";

  function handleInvite() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      toast.error(t("teamInviteFailed"));
      return;
    }
    startTransition(async () => {
      const result = await createWorkspaceInvite({ email: trimmed, role: "member" });
      if (result.ok) {
        toast.success(t("teamInviteSent"));
        setEmail("");
      } else if (result.error === "already_member") {
        toast.error(t("teamInviteAlreadyMember"));
      } else if (result.error === "already_invited") {
        toast.error(t("teamInviteAlreadyInvited"));
      } else {
        toast.error(t("teamInviteFailed"));
      }
    });
  }

  return (
    <>
      <motion.button
        ref={triggerRef}
        whileHover={{ y: -2 }}
        onClick={handleToggle}
        className={[
          "group flex items-center gap-4 rounded-2xl border px-4 py-2.5 backdrop-blur-2xl transition-all duration-300",
          open
            ? "border-violet-500/30 bg-violet-500/[0.07]"
            : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]",
        ].join(" ")}
      >
        <div className="flex -space-x-3">
          {members.slice(0, 3).map((member) => (
            <div
              key={member.id}
              className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-[#050816] bg-violet-500/20 ring-1 ring-white/[0.06]"
            >
              {member.profiles?.avatar_url ? (
                <Image src={member.profiles.avatar_url} alt="Member" fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-violet-200">
                  {memberInitials(member)}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden text-left lg:block">
          <p className="text-sm font-medium text-white">{t("teamWorkspace")}</p>
          <p className="mt-1 text-xs text-zinc-500">{t("activeMembers", { count: members.length })}</p>
        </div>
      </motion.button>

      {mounted && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={popoverRef}
              key="team-popover"
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "fixed", top: popupPos.top, left: popupPos.left, minWidth: Math.max(popupPos.width, 260), zIndex: 400 }}
              className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0A0F1F]/96 shadow-2xl backdrop-blur-2xl"
            >
              <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

              <div className="px-4 pt-4 pb-2">
                <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                  {t("teamPopoverMembers")}
                </p>
                <div className="space-y-1">
                  {members.map((member) => {
                    const isMe = member.user_id === currentUserId;
                    const name = member.profiles?.full_name || member.profiles?.email || "—";
                    const memberEmail = member.profiles?.email;
                    return (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.03]"
                      >
                        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/[0.08] bg-violet-500/20">
                          {member.profiles?.avatar_url ? (
                            <Image src={member.profiles.avatar_url} alt={name} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-violet-300">
                              {memberInitials(member)}
                            </div>
                          )}
                          {isMe && (
                            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[#0A0F1F] bg-emerald-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-white/80">
                            {name}
                            {isMe && <span className="ml-1.5 text-[9px] text-zinc-600">(you)</span>}
                          </p>
                          {memberEmail && name !== memberEmail && (
                            <p className="truncate text-[10px] text-zinc-600">{memberEmail}</p>
                          )}
                        </div>
                        <RoleBadge role={member.role} t={t} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {canInvite && (
                <>
                  <div className="mx-4 my-2 h-px bg-white/[0.05]" />
                  <div className="px-4 pb-4">
                    <p className="mb-2 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                      <UserPlus size={10} />
                      {t("teamInvite")}
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        disabled={isPending}
                        placeholder={t("teamInviteEmailPlaceholder")}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleInvite(); }}
                        className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white/80 placeholder-zinc-600 outline-none transition-colors focus:border-violet-500/40 focus:bg-white/[0.06] disabled:opacity-50"
                      />
                      <button
                        onClick={handleInvite}
                        disabled={isPending || !email.trim()}
                        className="rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {t("teamInviteSend")}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
