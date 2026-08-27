"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Users, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

import { TEAM_COLORS, TEAM_COLOR_CLASSES } from "@/types/team";
import type { WorkspaceTeamWithMembers, WorkspaceTeamMember, TeamColor } from "@/types/team";
import { createTeam } from "@/server/actions/teams/createTeam";
import { updateTeam } from "@/server/actions/teams/updateTeam";
import { deleteTeam } from "@/server/actions/teams/deleteTeam";
import { setMemberTeam } from "@/server/actions/teams/setMemberTeam";

import GunimiButton from "@/components/ui/GunimiButton";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  initialTeams: WorkspaceTeamWithMembers[];
  initialUnassigned: WorkspaceTeamMember[];
};

function MemberAvatar({ member, size = 26 }: { member: WorkspaceTeamMember; size?: number }) {
  const name = member.fullName || member.email || "?";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  if (member.avatarUrl) {
    return (
      <Image
        src={member.avatarUrl}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-[9px] font-semibold text-violet-300"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}

function TeamMemberRow({
  member,
  onRemove,
  removeLabel,
}: {
  member: WorkspaceTeamMember;
  onRemove: () => void;
  removeLabel: string;
}) {
  const name = member.fullName || member.email || "?";
  return (
    <div className="group/row flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/[0.04]">
      <MemberAvatar member={member} size={22} />
      <p className="min-w-0 flex-1 truncate text-xs text-white/60">{name}</p>
      <button
        onClick={onRemove}
        title={removeLabel}
        className="rounded-lg p-1 text-white/30 opacity-0 transition-all group-hover/row:opacity-100 hover:bg-rose-500/10 hover:text-rose-400"
      >
        <X size={10} />
      </button>
    </div>
  );
}

export default function TeamsSection({ initialTeams, initialUnassigned }: Props) {
  const t = useTranslations("teams");
  const [isPending, startTransition] = useTransition();
  const [teams, setTeams] = useState<WorkspaceTeamWithMembers[]>(initialTeams);
  const [unassigned, setUnassigned] = useState<WorkspaceTeamMember[]>(initialUnassigned);

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<TeamColor>("violet");
  const [editing, setEditing] = useState<{ id: string; name: string; color: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const allMembers: WorkspaceTeamMember[] = [
    ...unassigned,
    ...teams.flatMap((team) => team.members),
  ].sort((a, b) => (a.fullName || a.email).localeCompare(b.fullName || b.email));


  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    startTransition(async () => {
      const res = await createTeam(name, newColor);
      if (res.success && res.team) {
        setTeams((prev) => [...prev, { ...res.team!, members: [] }]);
        setNewName("");
        setNewColor("violet");
        setShowCreate(false);
        toast.success(t("teamCreated"));
      } else {
        toast.error(t("teamCreateFailed"));
      }
    });
  }

  function handleUpdate() {
    if (!editing) return;
    const name = editing.name.trim();
    if (!name) return;
    startTransition(async () => {
      const res = await updateTeam(editing.id, { name, color: editing.color as TeamColor });
      if (res.success) {
        setTeams((prev) =>
          prev.map((t) =>
            t.id === editing.id ? { ...t, name, color: editing.color } : t
          )
        );
        setEditing(null);
        toast.success(t("teamUpdated"));
      } else {
        toast.error(t("teamUpdateFailed"));
      }
    });
  }

  function handleDelete(teamId: string) {
    const team = teams.find((t) => t.id === teamId);
    startTransition(async () => {
      const res = await deleteTeam(teamId);
      if (res.success) {
        if (team) setUnassigned((prev) => [...prev, ...team.members]);
        setTeams((prev) => prev.filter((t) => t.id !== teamId));
        setDeleteId(null);
        toast.success(t("teamDeleted"));
      } else {
        toast.error(t("teamDeleteFailed"));
        setDeleteId(null);
      }
    });
  }

  function handleAssign(memberId: string, teamId: string) {
    const member = allMembers.find((m) => m.memberId === memberId);
    if (!member) return;
    startTransition(async () => {
      const res = await setMemberTeam(memberId, teamId);
      if (res.success) {
        setUnassigned((prev) => prev.filter((m) => m.memberId !== memberId));
        setTeams((prev) =>
          prev.map((t) => ({
            ...t,
            members:
              t.id === teamId
                ? [...t.members.filter((m) => m.memberId !== memberId), member]
                : t.members.filter((m) => m.memberId !== memberId),
          }))
        );
        toast.success(t("memberAssigned"));
      } else {
        toast.error(t("memberAssignFailed"));
      }
    });
  }

  function handleRemoveFromTeam(memberId: string, teamId: string) {
    const team = teams.find((t) => t.id === teamId);
    const member = team?.members.find((m) => m.memberId === memberId);
    if (!member) return;
    startTransition(async () => {
      const res = await setMemberTeam(memberId, null);
      if (res.success) {
        setTeams((prev) =>
          prev.map((t) =>
            t.id === teamId
              ? { ...t, members: t.members.filter((m) => m.memberId !== memberId) }
              : t
          )
        );
        setUnassigned((prev) => [...prev, member]);
        toast.success(t("memberRemoved"));
      } else {
        toast.error(t("memberRemoveFailed"));
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">{t("settingsTitle")}</h2>
          <p className="mt-1 text-sm text-white/40">{t("settingsSubtitle")}</p>
        </div>
        <GunimiButton
          variant="secondary"
          className="shrink-0 gap-1.5 px-3 py-2 text-xs"
          onClick={() => {
            setShowCreate((p) => !p);
            setEditing(null);
          }}
        >
          <Plus size={13} />
          {t("newTeam")}
        </GunimiButton>
      </div>

      {/* CREATE FORM */}
      {showCreate && (
        <div className="space-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="text-xs font-medium text-white/60">{t("createTeam")}</p>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setShowCreate(false);
            }}
            placeholder={t("teamNamePlaceholder")}
            autoFocus
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-violet-500/40"
          />
          <div className="flex flex-wrap gap-2">
            {TEAM_COLORS.map((c) => {
              const cls = TEAM_COLOR_CLASSES[c];
              return (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className={[
                    "h-6 w-6 rounded-full border-2 transition-all",
                    cls.dot,
                    newColor === c
                      ? "scale-110 border-white/70"
                      : "border-transparent opacity-40 hover:opacity-70",
                  ].join(" ")}
                  title={c}
                />
              );
            })}
          </div>
          <div className="flex gap-2">
            <GunimiButton
              variant="primary"
              className="gap-1.5 px-3 py-2 text-xs"
              loading={isPending}
              disabled={!newName.trim()}
              onClick={handleCreate}
            >
              <Check size={12} />
              {t("saveTeam")}
            </GunimiButton>
            <GunimiButton
              variant="secondary"
              className="gap-1.5 px-3 py-2 text-xs"
              onClick={() => setShowCreate(false)}
            >
              <X size={12} />
              {t("cancel")}
            </GunimiButton>
          </div>
        </div>
      )}

      {/* TEAMS GRID */}
      {teams.length === 0 && !showCreate ? (
        <GunimiEmptyState
          icon={Users}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      ) : (
        teams.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {teams.map((team) => {
              const cls =
                TEAM_COLOR_CLASSES[team.color as TeamColor] ?? TEAM_COLOR_CLASSES.violet;
              const isEditing = editing?.id === team.id;
              const isDeleting = deleteId === team.id;
              const assignable = allMembers.filter(
                (m) => !team.members.some((tm) => tm.memberId === m.memberId)
              );

              return (
                <div
                  key={team.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.10] hover:bg-white/[0.03]"
                >
                  {/* Color accent left bar */}
                  <div
                    className={`absolute bottom-4 left-0 top-4 w-[3px] rounded-r-full ${cls.dot}`}
                  />

                  <div className="pl-3">
                    {isDeleting ? (
                      <div className="flex flex-col gap-3">
                        <p className="text-sm text-white/60">
                          {t("deleteConfirm")}{" "}
                          <span className="font-medium text-white">{team.name}</span>?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(team.id)}
                            disabled={isPending}
                            className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 transition-colors hover:bg-rose-500/20 disabled:opacity-50"
                          >
                            {t("delete")}
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/40 transition-colors hover:text-white/70"
                          >
                            {t("cancel")}
                          </button>
                        </div>
                      </div>
                    ) : isEditing ? (
                      <div className="space-y-3">
                        <input
                          value={editing.name}
                          onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdate();
                            if (e.key === "Escape") setEditing(null);
                          }}
                          autoFocus
                          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-violet-500/40"
                        />
                        <div className="flex flex-wrap gap-1.5">
                          {TEAM_COLORS.map((c) => {
                            const cc = TEAM_COLOR_CLASSES[c];
                            return (
                              <button
                                key={c}
                                onClick={() => setEditing({ ...editing, color: c })}
                                className={[
                                  "h-5 w-5 rounded-full border-2 transition-all",
                                  cc.dot,
                                  editing.color === c
                                    ? "scale-110 border-white/70"
                                    : "border-transparent opacity-40 hover:opacity-70",
                                ].join(" ")}
                                title={c}
                              />
                            );
                          })}
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={handleUpdate}
                            disabled={isPending}
                            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 text-xs text-white/40 transition-colors hover:text-white/70"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Header row */}
                        <div className="flex items-center gap-2">
                          <p className="flex-1 text-sm font-semibold text-white">{team.name}</p>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${cls.bg} ${cls.text} ${cls.border}`}
                          >
                            {team.members.length}{" "}
                            {team.members.length === 1 ? t("member") : t("members")}
                          </span>
                          <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => {
                                setEditing({
                                  id: team.id,
                                  name: team.name,
                                  color: team.color,
                                });
                                setShowCreate(false);
                                setDeleteId(null);
                              }}
                              className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/70"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => setDeleteId(team.id)}
                              className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Member list */}
                        {team.members.length > 0 && (
                          <div className="-mx-1 space-y-0.5">
                            {team.members.map((m) => (
                              <TeamMemberRow
                                key={m.memberId}
                                member={m}
                                onRemove={() => handleRemoveFromTeam(m.memberId, team.id)}
                                removeLabel={t("removeFromTeam")}
                              />
                            ))}
                          </div>
                        )}

                        {/* Assign member */}
                        {assignable.length > 0 && (
                          <Select
                            value=""
                            onValueChange={(memberId) => handleAssign(memberId, team.id)}
                            disabled={isPending}
                          >
                            <SelectTrigger className="h-8 w-full text-xs text-white/35">
                              <SelectValue placeholder={t("assignMember")} />
                            </SelectTrigger>
                            <SelectContent>
                              {assignable.map((m) => (
                                <SelectItem key={m.memberId} value={m.memberId}>
                                  {m.fullName || m.email}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* UNASSIGNED MEMBERS */}
      {unassigned.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/25">
              {t("unassigned")} · {unassigned.length}
            </p>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
            {unassigned.map((m, i) => (
              <div
                key={m.memberId}
                className={[
                  "flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.02]",
                  i !== 0 ? "border-t border-white/[0.04]" : "",
                ].join(" ")}
              >
                <MemberAvatar member={m} size={26} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white/70">{m.fullName || m.email}</p>
                  {m.fullName && (
                    <p className="truncate text-xs text-white/30">{m.email}</p>
                  )}
                </div>
                {teams.length > 0 && (
                  <Select
                    value=""
                    onValueChange={(teamId) => handleAssign(m.memberId, teamId)}
                    disabled={isPending}
                  >
                    <SelectTrigger className="h-7 w-36 shrink-0 text-xs text-white/35">
                      <SelectValue placeholder={t("assignToTeam")} />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => {
                        const tc =
                          TEAM_COLOR_CLASSES[team.color as TeamColor] ??
                          TEAM_COLOR_CLASSES.violet;
                        return (
                          <SelectItem key={team.id} value={team.id}>
                            <span
                              className={`mr-2 inline-block h-2 w-2 rounded-full ${tc.dot}`}
                            />
                            {team.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
