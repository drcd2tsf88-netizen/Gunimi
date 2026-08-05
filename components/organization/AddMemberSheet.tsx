"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import Image from "next/image";
import { Check, Search } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiInput from "@/components/ui/GunimiInput";

import { addTeamMember } from "@/server/actions/organization/addTeamMember";
import type { WorkspaceTeamMember } from "@/types/organization";

type MemberRow = {
  id: string;
  user_id: string;
  role: string;
  profile: { full_name: string | null; avatar_url: string | null; email: string | null } | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  existingMemberIds: string[];
  allMembers: MemberRow[];
  onAdded: (member: WorkspaceTeamMember) => void;
};

export default function AddMemberSheet({
  open,
  onOpenChange,
  teamId,
  existingMemberIds,
  allMembers,
  onAdded,
}: Props) {
  const t = useTranslations("organization");
  const tc = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const available = allMembers.filter(
    (m) =>
      !existingMemberIds.includes(m.id) &&
      (m.profile?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        m.profile?.email?.toLowerCase().includes(search.toLowerCase()))
  );

  function handleClose() {
    setSearch("");
    setSelectedId(null);
    onOpenChange(false);
  }

  function handleAdd() {
    if (!selectedId) return;
    startTransition(async () => {
      const ok = await addTeamMember({ teamId, memberId: selectedId });
      if (ok) {
        const member = allMembers.find((m) => m.id === selectedId)!;
        toast.success(t("memberAdded"), { id: "add-member" });
        onAdded({
          id: crypto.randomUUID(),
          team_id: teamId,
          actor_id: selectedId,
          role: "member",
          joined_at: new Date().toISOString(),
          left_at: null,
          member: { id: member.id, user_id: member.user_id, role: member.role, profile: member.profile },
        });
        handleClose();
      } else {
        toast.error(t("memberAddFailed"), { id: "add-member" });
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 border-l border-white/[0.06] bg-[#080C14] p-0 sm:max-w-md">
        <SheetHeader className="border-b border-white/[0.06] px-6 py-5">
          <SheetTitle className="text-[15px] font-semibold text-[#F7F8FC]">
            {t("addMember")}
          </SheetTitle>
          <SheetDescription className="text-[12px] text-white/35">
            {t("addMemberDescription")}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="relative mb-4">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <GunimiInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchMembers")}
              className="pl-8"
            />
          </div>

          <div className="space-y-1">
            {available.length === 0 ? (
              <p className="py-8 text-center text-[12px] text-white/30">{t("noAvailableMembers")}</p>
            ) : (
              available.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setSelectedId(member.id === selectedId ? null : member.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
                >
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#6D5BFF]/15 text-[11px] font-semibold text-[#8B7DFF]">
                    {member.profile?.avatar_url ? (
                      <Image src={member.profile.avatar_url} alt="" fill className="object-cover" />
                    ) : (
                      (member.profile?.full_name?.[0] ?? "?").toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-white/80">
                      {member.profile?.full_name ?? member.profile?.email ?? "—"}
                    </p>
                    {member.profile?.email && member.profile?.full_name && (
                      <p className="truncate text-[11px] text-white/30">{member.profile.email}</p>
                    )}
                  </div>
                  {selectedId === member.id && (
                    <Check size={14} className="shrink-0 text-[#6D5BFF]" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <SheetFooter className="border-t border-white/[0.06] px-6 py-4">
          <div className="flex w-full gap-3">
            <GunimiButton variant="secondary" onClick={handleClose} className="flex-1">
              {tc("cancel")}
            </GunimiButton>
            <GunimiButton
              onClick={handleAdd}
              loading={isPending}
              disabled={!selectedId || isPending}
              className="flex-1"
            >
              {t("addMember")}
            </GunimiButton>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
