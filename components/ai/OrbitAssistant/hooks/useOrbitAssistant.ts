"use client";

import { useCallback, useState } from "react";

import toast from "react-hot-toast";

import { useTranslations } from "next-intl";

import { useAIStateStore } from "@/lib/store/ai-state-store";

import { useWorkspaceStore } from "@/lib/store/useWorkspaceStore";

import { generateOrbitResponse } from "@/lib/ai/services/generateOrbitResponse";

import { routeAgent } from "@/lib/ai/agents/route-agent";

import { executeOrbitActions } from "@/lib/ai/execution/executeOrbitActions";

import { loadMemory } from "@/lib/ai/memory/load-memory";

import { saveMemory } from "@/lib/ai/memory/save-memory";

export function useOrbitAssistant() {
  const t = useTranslations("aiPanel");

  const [loading, setLoading] = useState(false);

  // AI STORE

  const addMessage = useAIStateStore((state) => state.addMessage);

  const appendToMessage = useAIStateStore((state) => state.appendToMessage);

  const setMessageMetadata = useAIStateStore((state) => state.setMessageMetadata);

  const messages = useAIStateStore((state) => state.messages);

  const setThinking = useAIStateStore((state) => state.setThinking);

  const setCurrentThought = useAIStateStore((state) => state.setCurrentThought);

  // WORKSPACE

  const workspace = useWorkspaceStore((state) => state.workspace);

  const workspaceId = workspace?.id;

  // SEND MESSAGE

  const sendMessage = useCallback(
    async (input: string) => {
      if (!input.trim()) return;

      if (!workspaceId) {
        toast.error(t("workspaceNotFound"));
        return;
      }

      try {
        // LOADING

        setLoading(true);
        setThinking(true);
        setCurrentThought(t("thinkingAnalyzing"));

        // USER MESSAGE

        addMessage({
          id: crypto.randomUUID(),
          role: "user",
          content: input,
          createdAt: new Date().toISOString(),
        });

        // LOAD MEMORY

        await loadMemory(workspaceId);

        // AGENT

        const agent = routeAgent(input);

        setCurrentThought(t("thinkingDelegating", { agent: agent.name }));

        // PLACEHOLDER ASSISTANT MESSAGE (streams into it)

        const assistantId = crypto.randomUUID();

        addMessage({
          id: assistantId,
          role: "assistant",
          content: "",
          createdAt: new Date().toISOString(),
        });

        // GENERATE RESPONSE (streaming) — pass conversation history for multi-turn context

        const response = await generateOrbitResponse(
          {
            input,
            agent,
            history: messages.map((m) => ({ role: m.role, content: m.content })),
          },
          (token) => appendToMessage(assistantId, token)
        );

        // SAVE MEMORY

        await saveMemory({ workspaceId, role: "user", content: input });

        await saveMemory({
          workspaceId,
          role: "assistant",
          content: response.response,
        });

        // EXECUTION

        const execution = await executeOrbitActions({
          input,
          response: response.response,
          workspaceId,
        });

        // FINALIZE ASSISTANT MESSAGE METADATA

        setMessageMetadata(assistantId, {
          agent: agent.name,
          execution,
          actions: response.generatedActions,
        });

        // COMPLETE

        setCurrentThought(t("thinkingComplete"));
      } catch {
        toast.error(t("processingError"));
      } finally {
        setLoading(false);
        setThinking(false);
      }
    },

    [
      t,
      addMessage,
      appendToMessage,
      setMessageMetadata,
      messages,
      workspaceId,
      setThinking,
      setCurrentThought,
    ]
  );

  return {
    loading,
    sendMessage,
  };
}
