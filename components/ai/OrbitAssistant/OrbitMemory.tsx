"use client";

import { useState } from "react";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAIStateStore } from "@/lib/store/ai-state-store";

type MemoryItem = {
  role: string;
  content: string;
};

type OrbitMemoryProps = {
  aiMemory: MemoryItem[];
};

type Importance = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

const IMPORTANCE_STYLES: Record<Importance, { label: string; color: string; ring: string }> = {
  CRITICAL: { label: "Critical", color: "text-red-300", ring: "border-red-500/20 bg-red-500/[0.07]" },
  HIGH: { label: "High", color: "text-amber-300", ring: "border-amber-500/20 bg-amber-500/[0.07]" },
  MEDIUM: { label: "Medium", color: "text-violet-300", ring: "border-violet-500/20 bg-violet-500/[0.07]" },
  LOW: { label: "Low", color: "text-zinc-400", ring: "border-white/[0.06] bg-white/[0.02]" },
};

function parseMemoryItem(content: string): { importance: Importance; text: string } {
  const match = /^\[([A-Z]+)\]\s(.+)$/.exec(content);
  if (match) {
    const key = match[1] as Importance;
    return {
      importance: key in IMPORTANCE_STYLES ? key : "LOW",
      text: match[2],
    };
  }
  return { importance: "LOW", text: content };
}

export default function OrbitMemory({ aiMemory }: OrbitMemoryProps) {
  const t = useTranslations("aiPanel");
  const [expanded, setExpanded] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const clearMessages = useAIStateStore((state) => state.clearMessages);
  const setMemory = useAIStateStore((state) => state.setMemory);

  if (aiMemory.length === 0) return null;

  const visible = expanded ? aiMemory : aiMemory.slice(-3);
  const hiddenCount = aiMemory.length - 3;

  function handleClearSession() {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    clearMessages();
    setMemory([]);
    setConfirmClear(false);
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
      {/* HEADER */}
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Brain size={11} className="text-violet-400" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            {t("memoryLabel")}
          </p>
          <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[9px] text-violet-400">
            {aiMemory.length}
          </span>
        </div>
        <button
          onClick={handleClearSession}
          className={`text-[10px] transition-colors ${
            confirmClear ? "text-red-400 hover:text-red-300" : "text-zinc-600 hover:text-zinc-400"
          }`}
        >
          {confirmClear ? t("confirmClear") : t("clearSession")}
        </button>
      </div>

      {/* MEMORY ITEMS */}
      <div className="space-y-1.5">
        {visible.map((memory, index) => {
          const { importance, text } = parseMemoryItem(memory.content);
          const style = IMPORTANCE_STYLES[importance];
          return (
            <div
              key={index}
              className={`flex items-start gap-2 rounded-xl border px-2.5 py-2 ${style.ring}`}
            >
              <span className={`mt-0.5 shrink-0 text-[9px] font-semibold uppercase tracking-wider ${style.color}`}>
                {style.label}
              </span>
              <p className={`text-[11px] leading-relaxed ${style.color} opacity-75`}>
                {text}
              </p>
            </div>
          );
        })}
      </div>

      {/* EXPAND / COLLAPSE */}
      {hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex w-full items-center justify-center gap-1 text-[10px] text-zinc-600 transition-colors hover:text-zinc-400"
        >
          {expanded ? (
            <>
              <ChevronUp size={10} />
              {t("showLess")}
            </>
          ) : (
            <>
              <ChevronDown size={10} />
              {t("showMore", { count: hiddenCount })}
            </>
          )}
        </button>
      )}
    </div>
  );
}
