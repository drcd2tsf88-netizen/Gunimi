"use client";

import {
  useCallback,
  useState,
} from "react";

import toast
from "react-hot-toast";

import { useTranslations }
from "next-intl";

import { useAIStateStore }
from "@/lib/store/ai-state-store";

import { useWorkspaceStore }
from "@/lib/store/useWorkspaceStore";

import { buildOrbitContext }
from "@/lib/ai/context/buildOrbitContext";

import { generateOrbitResponse }
from "@/lib/ai/services/generateOrbitResponse";

import { routeAgent }
from "@/lib/ai/agents/route-agent";

import { executeOrbitActions }
from "@/lib/ai/execution/executeOrbitActions";

import { loadMemory }
from "@/lib/ai/memory/load-memory";

import { saveMemory }
from "@/lib/ai/memory/save-memory";

export function useOrbitAssistant() {
  const t = useTranslations("aiPanel");

  const [
    loading,
    setLoading,
  ] = useState(false);

  // AI STORE

  const addMessage =
    useAIStateStore(
      (state) =>
        state.addMessage
    );

  const appendToMessage =
    useAIStateStore(
      (state) =>
        state.appendToMessage
    );

  const setMessageMetadata =
    useAIStateStore(
      (state) =>
        state.setMessageMetadata
    );

  const messages =
    useAIStateStore(
      (state) =>
        state.messages
    );

  const aiMemory =
    useAIStateStore(
      (state) =>
        state.memory
    );

  const workflowTimeline =
    useAIStateStore(
      (state) =>
        state.workflowTimeline
    );

  const setThinking =
    useAIStateStore(
      (state) =>
        state.setThinking
    );

  const setCurrentThought =
    useAIStateStore(
      (state) =>
        state.setCurrentThought
    );

  // WORKSPACE

  const workspace =
    useWorkspaceStore(
      (state) =>
        state.workspace
    );

  const workspaceId =
    workspace?.id;

  // SEND MESSAGE

  const sendMessage =
    useCallback(
      async (
        input: string
      ) => {
        if (
          !input.trim()
        ) {
          return;
        }

        if (
          !workspaceId
        ) {
          toast.error(
            t("workspaceNotFound")
          );

          return;
        }

        try {
          // LOADING

          setLoading(true);

          setThinking(
            true
          );

          setCurrentThought(
            t("thinkingAnalyzing")
          );

          // USER MESSAGE

          addMessage({
            id:
              crypto.randomUUID(),

            role:
              "user",

            content:
              input,

            createdAt:
              new Date().toISOString(),
          });

          // LOAD MEMORY

          await loadMemory(
            workspaceId
          );

          // AGENT

          const agent =
            routeAgent(
              input
            );

          setCurrentThought(
            t("thinkingDelegating", { agent: agent.name })
          );

          // CONTEXT

          const context =
            buildOrbitContext({
              messages,

              aiMemory:
                aiMemory.map(
                  (
                    item
                  ) =>
                    item.content
                ),

              workflowTimeline:
                workflowTimeline.map(
                  (
                    item
                  ) =>
                    item.title
                ),

              activeAgent:
                agent.name,

              workspaceContext:
                {
                  workspaceName:
                    workspace?.name,

                  activeTasks:
                    workspace
                      ?.stats
                      ?.tasks ??
                    0,

                  overdueTasks: 0,

                  crmLeads:
                    workspace
                      ?.stats
                      ?.contacts ??
                    0,

                  aiActions: 0,

                  productivity:
                    "Operational",
                },
            });

          // PLACEHOLDER ASSISTANT MESSAGE (streams into it)

          const assistantId = crypto.randomUUID();

          addMessage({
            id: assistantId,
            role: "assistant",
            content: "",
            createdAt: new Date().toISOString(),
          });

          // GENERATE RESPONSE (streaming)

          const response =
            await generateOrbitResponse(
              {
                input,

                context,

                agent,

                workspaceMemory:
                  aiMemory.map(
                    (
                      item
                    ) =>
                      item.content
                  ),

                workspaceContext:
                  {
                    activeTasks:
                      workspace
                        ?.stats
                        ?.tasks ??
                      0,

                    overdueTasks: 0,

                    crmLeads:
                      workspace
                        ?.stats
                        ?.contacts ??
                      0,

                    aiActions: 0,

                    productivity:
                      "Operational",
                  },
              },
              (token) => appendToMessage(assistantId, token)
            );

          // SAVE MEMORY

          await saveMemory({
            workspaceId,

            role:
              "user",

            content:
              input,
          });

          await saveMemory({
            workspaceId,

            role:
              "assistant",

            content:
              response.response,
          });

          // EXECUTION

          const execution =
            await executeOrbitActions(
              {
                input,

                response:
                  response.response,

                workspaceId,
              }
            );

          // FINALIZE ASSISTANT MESSAGE METADATA

          setMessageMetadata(assistantId, {
            agent: agent.name,
            execution,
            actions: response.generatedActions,
          });

          // COMPLETE

          setCurrentThought(
            t("thinkingComplete")
          );
        } catch (error) {
          console.error(
            error
          );

          toast.error(
            t("processingError")
          );
        } finally {
          setLoading(
            false
          );

          setThinking(
            false
          );
        }
      },

      [
        t,
        addMessage,
        appendToMessage,
        setMessageMetadata,
        aiMemory,
        messages,
        workflowTimeline,
        workspace,
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