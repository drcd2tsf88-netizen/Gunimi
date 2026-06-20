"use client";

import { useEffect, useState } from "react";

import { Sparkles } from "lucide-react";

import { supabase } from "@/lib/supabase";

type AIState = {
  context: string;
};

export default function OrbitAIStatus() {
  const [aiState, setAIState] = useState<AIState | null>(null);

  async function loadAIState() {
    const { data, error } = await supabase
      .from("workspace_ai_state")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    setAIState(data);
  }

  useEffect(() => {
    loadAIState();

    const channel = supabase
      .channel("workspace-ai-state-topbar")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workspace_ai_state" },
        () => { loadAIState(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!aiState?.context) return null;

  return (
    <div
      className="
        hidden items-center gap-2
        rounded-full
        border border-white/10
        bg-white/[0.03]
        px-3 py-2
        lg:flex
      "
    >
      <Sparkles className="h-3.5 w-3.5 text-violet-300" />
      <p className="max-w-[200px] truncate text-[11px] text-white/50">
        {aiState.context}
      </p>
    </div>
  );
}
