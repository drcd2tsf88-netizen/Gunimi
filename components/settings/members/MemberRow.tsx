"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import { Trash2 } from "lucide-react";

import toast from "react-hot-toast";

import { cn } from "@/lib/utils";

import Image from "next/image";

import { updateMemberRole } from "@/server/actions/workspace/updateMemberRole";

import GunimiButton from "@/components/ui/GunimiButton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type MemberProfile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  status: string | null;
};

export type MemberRowData = {
  id: string;
  role: string;
  user_id: string;
  profiles: MemberProfile | null;
};

type Props = {
  member: MemberRowData;
  currentUserId: string;
  currentUserRole: string;
  onRemoveRequest: (memberId: string, name: string) => void;
};

function Avatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-[11px] font-semibold text-violet-300">
      {initials}
    </div>
  );
}

const ROLE_KEY_MAP = {
  owner: "role_owner",
  admin: "role_admin",
  member: "role_member",
} as const;

const ROLE_BADGE: Record<string, string> = {
  owner: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  admin: "border-blue-500/20 bg-blue-500/10 text-blue-300",
  member: "border-white/10 bg-white/[0.04] text-white/50",
};

export default function MemberRow({ member, currentUserId, currentUserRole, onRemoveRequest }: Props) {
  const t = useTranslations("settings");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const profile = member.profiles;
  const name = profile?.full_name || profile?.email || "Unknown";
  const isCurrentUser = member.user_id === currentUserId;
  const isOwner = member.role === "owner";
  const canChangeRole = currentUserRole === "owner" && !isOwner && !isCurrentUser;
  const canRemove =
    !isOwner &&
    !isCurrentUser &&
    (currentUserRole === "owner" || (currentUserRole === "admin" && member.role === "member"));

  function handleRoleChange(role: string) {
    startTransition(async () => {
      const ok = await updateMemberRole(member.id, role);
      if (ok) {
        toast.success(t("roleChanged"));
        router.refresh();
      } else {
        toast.error(t("failedToChangeRole"));
      }
    });
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <Avatar name={name} avatarUrl={profile?.avatar_url ?? null} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-white">{name}</p>
          {isCurrentUser && (
            <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-300">
              {t("you")}
            </span>
          )}
        </div>
        {profile?.email && (
          <p className="mt-0.5 truncate text-xs text-white/35">{profile.email}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {canChangeRole ? (
          <Select value={member.role} onValueChange={handleRoleChange} disabled={isPending}>
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">{t("roleAdmin")}</SelectItem>
              <SelectItem value="member">{t("roleMember")}</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              ROLE_BADGE[member.role] ?? ROLE_BADGE.member
            )}
          >
            {t(ROLE_KEY_MAP[member.role as keyof typeof ROLE_KEY_MAP] ?? "role_member")}
          </span>
        )}

        {canRemove && (
          <GunimiButton
            variant="danger"
            className="h-8 w-8 p-0"
            onClick={() => onRemoveRequest(member.id, name)}
            disabled={isPending}
          >
            <Trash2 size={13} />
          </GunimiButton>
        )}
      </div>
    </div>
  );
}
