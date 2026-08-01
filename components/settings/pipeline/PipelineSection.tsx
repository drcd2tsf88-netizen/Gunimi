"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import { ArrowDown, ArrowUp, Check, Pencil, Plus, Trash2, X } from "lucide-react";

import GunimiCard from "@/components/ui/GunimiCard";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiInput from "@/components/ui/GunimiInput";
import GunimiField from "@/components/ui/GunimiField";

import { cn } from "@/lib/utils";
import { STAGE_COLORS, STAGE_DOT_CLASS } from "@/lib/deals/defaultStages";
import type { WorkspaceDealStage } from "@/types/dealStage";

import { createDealStage } from "@/server/actions/deals/createDealStage";
import { updateDealStageRecord } from "@/server/actions/deals/updateDealStageRecord";
import { deleteDealStageRecord } from "@/server/actions/deals/deleteDealStageRecord";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type StageType = "open" | "won" | "lost";

type Props = {
  initialStages: WorkspaceDealStage[];
};

export default function PipelineSection({ initialStages }: Props) {
  const t = useTranslations("settings");
  const [stages, setStages] = useState(initialStages);
  const [isPending, startTransition] = useTransition();

  // Add form state
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("violet");
  const [newType, setNewType] = useState<StageType>("open");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("violet");
  const [editType, setEditType] = useState<StageType>("open");

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<WorkspaceDealStage | null>(null);
  const [isDeleting, startDelete] = useTransition();

  function startEdit(stage: WorkspaceDealStage) {
    setEditingId(stage.id);
    setEditName(stage.name);
    setEditColor(stage.color);
    setEditType(stage.is_won ? "won" : stage.is_lost ? "lost" : "open");
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function handleAdd() {
    if (!newName.trim()) return;
    startTransition(async () => {
      const created = await createDealStage({
        name: newName.trim(),
        color: newColor,
        is_won: newType === "won",
        is_lost: newType === "lost",
      });
      if (!created) {
        toast.error(t("pipelineCreateFailed"));
        return;
      }
      setStages((prev) => [...prev, created]);
      setNewName("");
      setNewColor("violet");
      setNewType("open");
      setShowAdd(false);
      toast.success(t("pipelineStageCreated"));
    });
  }

  function handleSaveEdit() {
    if (!editingId || !editName.trim()) return;
    startTransition(async () => {
      const ok = await updateDealStageRecord({
        id: editingId,
        name: editName.trim(),
        color: editColor,
        is_won: editType === "won",
        is_lost: editType === "lost",
      });
      if (!ok) {
        toast.error(t("pipelineUpdateFailed"));
        return;
      }
      setStages((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? { ...s, name: editName.trim(), color: editColor, is_won: editType === "won", is_lost: editType === "lost" }
            : s
        )
      );
      setEditingId(null);
      toast.success(t("pipelineStageUpdated"));
    });
  }

  function handleMove(stage: WorkspaceDealStage, direction: "up" | "down") {
    const idx = stages.findIndex((s) => s.id === stage.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= stages.length) return;

    const other = stages[swapIdx];

    startTransition(async () => {
      await Promise.all([
        updateDealStageRecord({ id: stage.id, order_index: other.order_index }),
        updateDealStageRecord({ id: other.id, order_index: stage.order_index }),
      ]);

      setStages((prev) => {
        const next = [...prev];
        next[idx] = { ...stage, order_index: other.order_index };
        next[swapIdx] = { ...other, order_index: stage.order_index };
        return next.sort((a, b) => a.order_index - b.order_index);
      });
    });
  }

  function handleDelete(stage: WorkspaceDealStage) {
    startDelete(async () => {
      const result = await deleteDealStageRecord(stage.id);
      if (!result.ok) {
        if (result.reason === "deals_exist") {
          toast.error(t("pipelineDeleteHasDeals"));
        } else {
          toast.error(t("pipelineDeleteFailed"));
        }
        setDeleteTarget(null);
        return;
      }
      setStages((prev) => prev.filter((s) => s.id !== stage.id));
      setDeleteTarget(null);
      toast.success(t("pipelineStageDeleted"));
    });
  }

  const sortedStages = [...stages].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="space-y-6">
      <GunimiCard className="p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{t("pipelineTitle")}</h2>
            <p className="mt-1 text-sm text-zinc-400">{t("pipelineSubtitle")}</p>
          </div>
          {!showAdd && (
            <GunimiButton onClick={() => setShowAdd(true)} className="shrink-0">
              <Plus size={14} />
              {t("pipelineAddStage")}
            </GunimiButton>
          )}
        </div>

        {/* Stage list */}
        <div className="space-y-2">
          {sortedStages.map((stage, index) => (
            <div key={stage.id}>
              {editingId === stage.id ? (
                /* EDIT ROW */
                <div className="rounded-xl border border-violet-500/30 bg-violet-500/[0.04] p-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <GunimiField label={t("pipelineStageName")}>
                      <GunimiInput
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        disabled={isPending}
                      />
                    </GunimiField>

                    <GunimiField label={t("pipelineStageColor")}>
                      <Select value={editColor} onValueChange={setEditColor} disabled={isPending}>
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <span className={cn("h-3 w-3 rounded-full", STAGE_DOT_CLASS[editColor] ?? "bg-zinc-500")} />
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {STAGE_COLORS.map((c) => (
                            <SelectItem key={c} value={c}>
                              <div className="flex items-center gap-2">
                                <span className={cn("h-3 w-3 rounded-full", STAGE_DOT_CLASS[c])} />
                                <span>{t(`color_${c}`)}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </GunimiField>

                    <GunimiField label={t("pipelineStageType")}>
                      <Select value={editType} onValueChange={(v) => setEditType(v as StageType)} disabled={isPending}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">{t("pipelineTypeOpen")}</SelectItem>
                          <SelectItem value="won">{t("pipelineTypeWon")}</SelectItem>
                          <SelectItem value="lost">{t("pipelineTypeLost")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </GunimiField>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <GunimiButton loading={isPending} onClick={handleSaveEdit}>
                      <Check size={13} />
                      {t("pipelineSave")}
                    </GunimiButton>
                    <GunimiButton variant="secondary" disabled={isPending} onClick={cancelEdit}>
                      <X size={13} />
                      {t("pipelineCancel")}
                    </GunimiButton>
                  </div>
                </div>
              ) : (
                /* DISPLAY ROW */
                <div className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-all hover:border-white/[0.10]">
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", STAGE_DOT_CLASS[stage.color] ?? "bg-zinc-500")} />

                  <span className="flex-1 text-sm font-medium">{stage.name}</span>

                  {stage.is_won && (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                      {t("pipelineTypeWon")}
                    </span>
                  )}
                  {stage.is_lost && (
                    <span className="rounded-full border border-zinc-500/30 bg-zinc-500/10 px-2 py-0.5 text-[10px] text-zinc-400">
                      {t("pipelineTypeLost")}
                    </span>
                  )}

                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => handleMove(stage, "up")}
                      disabled={index === 0 || isPending}
                      className="rounded-lg p-1.5 text-white/30 transition-colors hover:text-white/70 disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => handleMove(stage, "down")}
                      disabled={index === sortedStages.length - 1 || isPending}
                      className="rounded-lg p-1.5 text-white/30 transition-colors hover:text-white/70 disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => startEdit(stage)}
                      className="rounded-lg p-1.5 text-white/30 transition-colors hover:text-white/70"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(stage)}
                      className="rounded-lg p-1.5 text-white/30 transition-colors hover:text-red-400"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ADD FORM */}
        {showAdd && (
          <div className="mt-4 rounded-xl border border-violet-500/30 bg-violet-500/[0.04] p-4">
            <p className="mb-4 text-sm font-medium">{t("pipelineNewStage")}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <GunimiField label={t("pipelineStageName")}>
                <GunimiInput
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t("pipelineStageNamePlaceholder")}
                  disabled={isPending}
                />
              </GunimiField>

              <GunimiField label={t("pipelineStageColor")}>
                <Select value={newColor} onValueChange={setNewColor} disabled={isPending}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <span className={cn("h-3 w-3 rounded-full", STAGE_DOT_CLASS[newColor] ?? "bg-zinc-500")} />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {STAGE_COLORS.map((c) => (
                      <SelectItem key={c} value={c}>
                        <div className="flex items-center gap-2">
                          <span className={cn("h-3 w-3 rounded-full", STAGE_DOT_CLASS[c])} />
                          <span>{t(`color_${c}`)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </GunimiField>

              <GunimiField label={t("pipelineStageType")}>
                <Select value={newType} onValueChange={(v) => setNewType(v as StageType)} disabled={isPending}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">{t("pipelineTypeOpen")}</SelectItem>
                    <SelectItem value="won">{t("pipelineTypeWon")}</SelectItem>
                    <SelectItem value="lost">{t("pipelineTypeLost")}</SelectItem>
                  </SelectContent>
                </Select>
              </GunimiField>
            </div>

            <div className="mt-4 flex gap-2">
              <GunimiButton loading={isPending} onClick={handleAdd} disabled={!newName.trim()}>
                <Plus size={13} />
                {t("pipelineAddStage")}
              </GunimiButton>
              <GunimiButton variant="secondary" disabled={isPending} onClick={() => setShowAdd(false)}>
                <X size={13} />
                {t("pipelineCancel")}
              </GunimiButton>
            </div>
          </div>
        )}
      </GunimiCard>

      {/* DELETE DIALOG */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("pipelineDeleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("pipelineDeleteConfirm", { name: deleteTarget?.name ?? "" })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <GunimiButton variant="secondary" disabled={isDeleting} onClick={() => setDeleteTarget(null)}>
              {t("pipelineCancel")}
            </GunimiButton>
            <GunimiButton
              variant="danger"
              loading={isDeleting}
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              {t("pipelineDelete")}
            </GunimiButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
