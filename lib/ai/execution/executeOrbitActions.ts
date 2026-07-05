"use client";

import { useAIStateStore } from "@/lib/store/ai-state-store";

type ExecuteOrbitActionsProps = {
  input: string;
  response: string;
  workspaceId: string;
};

export async function executeOrbitActions({}: ExecuteOrbitActionsProps) {
  const { setThinking, setCurrentThought } = useAIStateStore.getState();

  try {
    setThinking(true);
    setCurrentThought("");

    // Explicit AI-requested actions are processed here.
    // Keyword-based auto-execution was removed — actions are only executed
    // when the AI explicitly signals a structured write operation.
    return [] as string[];
  } catch {
    return [] as string[];
  } finally {
    setTimeout(() => {
      setThinking(false);
      setCurrentThought("");
    }, 400);
  }
}
