"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { createCustomRule } from "@/server/actions/automation/createCustomRule";
import type {
  AutomationTrigger,
  RuleCondition,
  RuleConditionField,
  RuleConditionOperator,
  RuleActionParams,
} from "@/lib/automation/types";

const TRIGGERS: AutomationTrigger[] = [
  "deal.won",
  "deal.lost",
  "deal.created",
  "contact.created",
  "company.created",
];

const CONDITION_FIELDS: RuleConditionField[] = ["deal_value"];
const CONDITION_OPS: RuleConditionOperator[] = ["gt", "lt", "gte", "lte", "eq"];

const DEAL_TRIGGERS = new Set<AutomationTrigger>(["deal.won", "deal.lost", "deal.created"]);

type Props = {
  open: boolean;
  onClose: () => void;
};

function emptyCondition(): RuleCondition {
  return { field: "deal_value", operator: "gt", value: 0 };
}

export default function NewRuleSheet({ open, onClose }: Props) {
  const t = useTranslations("automations");

  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState<AutomationTrigger>("deal.created");
  const [conditions, setConditions] = useState<RuleCondition[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [priority, setPriority] = useState<RuleActionParams["priority"]>("medium");
  const [isPending, startSave] = useTransition();

  function reset() {
    setName("");
    setTrigger("deal.created");
    setConditions([]);
    setTaskTitle("");
    setPriority("medium");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function addCondition() {
    setConditions((prev) => [...prev, emptyCondition()]);
  }

  function removeCondition(idx: number) {
    setConditions((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateCondition<K extends keyof RuleCondition>(
    idx: number,
    key: K,
    value: RuleCondition[K]
  ) {
    setConditions((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [key]: value } : c))
    );
  }

  function handleSave() {
    if (!name.trim() || !taskTitle.trim()) return;
    startSave(async () => {
      const result = await createCustomRule({
        name: name.trim(),
        trigger,
        conditions: DEAL_TRIGGERS.has(trigger) ? conditions : [],
        action_type: "create_task",
        action_params: { title_template: taskTitle.trim(), priority },
      });
      if (result.success) {
        toast.success(t("ruleSaved"));
        handleClose();
      } else {
        toast.error(
          result.error === "unauthorized" ? t("customRuleUnauthorized") : t("ruleSaveFailed")
        );
      }
    });
  }

  if (!open) return null;

  const canAddCondition = DEAL_TRIGGERS.has(trigger) && conditions.length < 3;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-white/[0.06] bg-zinc-950 shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {t("customRulesBadge")}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-white/90">{t("newRuleTitle")}</p>
          </div>
          <button
            onClick={handleClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/70"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
              {t("newRuleNameLabel")}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("newRuleNamePlaceholder")}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white/85 placeholder-white/20 outline-none transition-colors focus:border-violet-500/40 focus:bg-white/[0.05]"
            />
          </div>

          {/* Trigger */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
              {t("newRuleTriggerLabel")}
            </label>
            <select
              value={trigger}
              onChange={(e) => {
                const val = e.target.value as AutomationTrigger;
                setTrigger(val);
                if (!DEAL_TRIGGERS.has(val)) setConditions([]);
              }}
              className="w-full rounded-lg border border-white/[0.08] bg-zinc-900 px-3 py-2 text-sm text-white/85 outline-none transition-colors focus:border-violet-500/40"
            >
              {TRIGGERS.map((tr) => (
                <option key={tr} value={tr}>
                  {t(`trigger${tr.split(".").map((s) => s[0].toUpperCase() + s.slice(1)).join("")}` as Parameters<typeof t>[0])}
                </option>
              ))}
            </select>
          </div>

          {/* Conditions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                {t("newRuleConditionsLabel")}
              </label>
              {canAddCondition && (
                <button
                  onClick={addCondition}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-violet-400 transition-colors hover:bg-violet-500/10"
                >
                  <Plus size={10} />
                  {t("addCondition")}
                </button>
              )}
            </div>

            {conditions.length === 0 ? (
              <p className="text-xs text-white/20">
                {DEAL_TRIGGERS.has(trigger)
                  ? `— ${t("addCondition")}`
                  : "—"}
              </p>
            ) : (
              <div className="space-y-2">
                {conditions.map((cond, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                  >
                    <select
                      value={cond.field}
                      onChange={(e) =>
                        updateCondition(idx, "field", e.target.value as RuleConditionField)
                      }
                      className="flex-1 bg-transparent text-xs text-white/70 outline-none"
                    >
                      {CONDITION_FIELDS.map((f) => (
                        <option key={f} value={f}>
                          {t(`conditionField${f.split("_").map((s) => s[0].toUpperCase() + s.slice(1)).join("")}` as Parameters<typeof t>[0])}
                        </option>
                      ))}
                    </select>

                    <select
                      value={cond.operator}
                      onChange={(e) =>
                        updateCondition(idx, "operator", e.target.value as RuleConditionOperator)
                      }
                      className="flex-1 bg-transparent text-xs text-white/70 outline-none"
                    >
                      {CONDITION_OPS.map((op) => (
                        <option key={op} value={op}>
                          {t(`conditionOp${op.charAt(0).toUpperCase() + op.slice(1)}` as Parameters<typeof t>[0])}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      value={cond.value}
                      onChange={(e) =>
                        updateCondition(idx, "value", parseFloat(e.target.value) || 0)
                      }
                      className="w-20 bg-transparent text-right text-xs text-white/85 outline-none"
                    />

                    <button
                      onClick={() => removeCondition(idx)}
                      className="text-white/20 transition-colors hover:text-red-400"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action */}
          <div className="space-y-3">
            <label className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
              {t("newRuleActionLabel")}
            </label>

            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-600">{t("newRuleTaskTitleLabel")}</label>
              <input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder={t("newRuleTaskTitlePlaceholder")}
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white/85 placeholder-white/20 outline-none transition-colors focus:border-violet-500/40 focus:bg-white/[0.05]"
              />
              <p className="text-[10px] text-zinc-600">{t("newRuleTaskTitleHint")}</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-600">{t("newRulePriorityLabel")}</label>
              <div className="flex gap-2">
                {(["low", "medium", "high"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex-1 rounded-lg border py-1.5 text-xs transition-colors ${
                      priority === p
                        ? "border-violet-500/40 bg-violet-500/15 text-violet-300"
                        : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/10 hover:text-white/60"
                    }`}
                  >
                    {t(`priority${p.charAt(0).toUpperCase() + p.slice(1)}` as Parameters<typeof t>[0])}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-white/[0.06] px-6 py-4">
          <button
            onClick={handleClose}
            className="rounded-lg border border-white/[0.06] px-4 py-2 text-xs text-white/40 transition-colors hover:border-white/10 hover:text-white/70"
          >
            {t("cancelRule")}
          </button>
          <button
            onClick={handleSave}
            disabled={isPending || !name.trim() || !taskTitle.trim()}
            className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending ? t("saving") : t("saveRule")}
          </button>
        </div>
      </div>
    </div>
  );
}
