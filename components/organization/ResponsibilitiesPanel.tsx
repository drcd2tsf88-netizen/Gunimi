"use client";

import { useState, useTransition, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, X, UsersRound } from "lucide-react";
import toast from "react-hot-toast";

import GunimiCard from "@/components/ui/GunimiCard";
import GunimiButton from "@/components/ui/GunimiButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getAssignments } from "@/server/actions/organization/getAssignments";
import { createAssignment } from "@/server/actions/organization/createAssignment";
import { updateAssignmentStatus } from "@/server/actions/organization/updateAssignmentStatus";
import type {
  WorkspaceAssignmentWithActor,
  WorkspaceTeam,
  Responsibility,
} from "@/types/organization";

const STATUS_STYLES: Record<string, string> = {
  active:    "text-emerald-400",
  proposed:  "text-amber-400",
  waiting:   "text-blue-400",
  blocked:   "text-red-400",
  accepted:  "text-emerald-400",
};

type Props = {
  entityType: "deal" | "contact" | "company";
  entityId: string;
  teams: WorkspaceTeam[];
};

export default function ResponsibilitiesPanel({ entityType, entityId, teams }: Props) {
  const t = useTranslations("organization");
  const tc = useTranslations("common");
  const [assignments, setAssignments] = useState<WorkspaceAssignmentWithActor[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedResponsibility, setSelectedResponsibility] = useState<Responsibility>("owner");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getAssignments({ entityType, entityId }).then((data) => {
      setAssignments(data);
      setLoading(false);
    });
  }, [entityType, entityId]);

  function handleAdd() {
    if (!selectedTeamId) return;
    startTransition(async () => {
      const result = await createAssignment({
        entityType,
        entityId,
        actorType: "team",
        actorId: selectedTeamId,
        responsibility: selectedResponsibility,
      });
      if (result) {
        const team = teams.find((t) => t.id === selectedTeamId) ?? null;
        setAssignments((prev) => [...prev, { ...result, team }]);
        toast.success(t("assignmentCreated"), { id: "assignment-create" });
        setAdding(false);
        setSelectedTeamId("");
        setSelectedResponsibility("owner");
      } else {
        toast.error(t("assignmentCreateFailed"), { id: "assignment-create" });
      }
    });
  }

  function handleRemove(assignmentId: string) {
    startTransition(async () => {
      const ok = await updateAssignmentStatus({
        assignmentId,
        status: "cancelled",
        closedReason: "manually_removed",
      });
      if (ok) {
        setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      }
    });
  }

  const responsibilities: Responsibility[] = ["owner", "collaborator", "reviewer", "approver", "observer"];
  const assignedTeamIds = assignments.map((a) => a.actor_id);
  const availableTeams = teams.filter((t) => !assignedTeamIds.includes(t.id));

  if (loading) return null;

  return (
    <GunimiCard className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
          {t("responsibilities")}
        </h3>
        {!adding && availableTeams.length > 0 && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 text-[11px] text-white/30 transition-colors hover:text-white/60"
          >
            <Plus size={11} />
            {t("assignTeam")}
          </button>
        )}
      </div>

      {assignments.length === 0 && !adding && (
        <p className="text-[12px] text-white/25">{t("noResponsibilities")}</p>
      )}

      <div className="space-y-2">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="flex items-center gap-3 rounded-xl border border-white/[0.04] px-3 py-2.5"
          >
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `${assignment.team?.color ?? "#6D5BFF"}18`,
                border: `1px solid ${assignment.team?.color ?? "#6D5BFF"}30`,
              }}
            >
              <UsersRound size={12} style={{ color: assignment.team?.color ?? "#8B7DFF" }} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-white/75">
                {assignment.team?.name ?? t("unknownTeam")}
              </p>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-[10px] text-white/30">
                  {t(`responsibility.${assignment.responsibility}`)}
                </span>
                <span className="text-white/15">·</span>
                <span className={`text-[10px] ${STATUS_STYLES[assignment.status] ?? "text-white/30"}`}>
                  {t(`status.${assignment.status}`)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemove(assignment.id)}
              disabled={isPending}
              className="shrink-0 text-white/20 transition-colors hover:text-white/50"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {adding && (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/30">
                {t("selectTeam")}
              </label>
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger className="h-9 text-[12px]">
                  <SelectValue placeholder={t("selectTeamPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {availableTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id} className="text-[12px]">
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/30">
                {t("selectResponsibility")}
              </label>
              <Select value={selectedResponsibility} onValueChange={(v) => setSelectedResponsibility(v as Responsibility)}>
                <SelectTrigger className="h-9 text-[12px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {responsibilities.map((r) => (
                    <SelectItem key={r} value={r} className="text-[12px]">
                      {t(`responsibility.${r}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <GunimiButton
                variant="secondary"
                onClick={() => setAdding(false)}
                className="flex-1 py-1.5 text-[12px]"
              >
                {tc("cancel")}
              </GunimiButton>
              <GunimiButton
                onClick={handleAdd}
                loading={isPending}
                disabled={!selectedTeamId || isPending}
                className="flex-1 py-1.5 text-[12px]"
              >
                {t("assignTeam")}
              </GunimiButton>
            </div>
          </div>
        )}
      </div>
    </GunimiCard>
  );
}
