"use client";

import { createTask }
from "@/server/actions/tasks/createTask";

import { createActivity }
from "@/server/actions/activity/createActivity";

import { useAIStateStore }
from "@/lib/store/ai-state-store";

type ExecuteOrbitActionsProps = {
  input: string;

  response: string;

  workspaceId: string;
};

export async function executeOrbitActions({
  input,
  response,
}: ExecuteOrbitActionsProps) {
  const executed: string[] =
    [];

  const {
    setThinking,

    setCurrentThought,
  } =
    useAIStateStore.getState();

  try {
    // AI THINKING

    setThinking(true);

    setCurrentThought(
      "Analyzing autonomous execution..."
    );

    const lowerInput =
      input.toLowerCase();

    const lowerResponse =
      response.toLowerCase();

    // TASK EXECUTION

    if (
      lowerInput.includes(
        "task"
      ) ||
      lowerResponse.includes(
        "task"
      )
    ) {
      setCurrentThought(
        "Generating task workflows..."
      );

      const task =
        await createTask({
          title: input,

          priority:
            "high",
        });

      await createActivity({
        type:
          "ai_task",

        title:
          "Orbit AI executed task workflow",

        description:
          task?.title ??
          input,
      });

      executed.push(
        `Task executed: ${input}`
      );
    }

    // CRM EXECUTION

    if (
      lowerInput.includes(
        "crm"
      ) ||
      lowerInput.includes(
        "lead"
      ) ||
      lowerResponse.includes(
        "crm"
      )
    ) {
      setCurrentThought(
        "Analyzing CRM intelligence..."
      );

      await createActivity({
        type:
          "crm_workflow",

        title:
          "Orbit AI launched CRM workflow",

        description:
          input,
      });

      executed.push(
        `CRM workflow executed: ${input}`
      );
    }

    // WORKFLOW EXECUTION

    if (
      lowerInput.includes(
        "workflow"
      ) ||
      lowerInput.includes(
        "automation"
      )
    ) {
      setCurrentThought(
        "Launching workflow engine..."
      );

      await createActivity({
        type:
          "workflow",

        title:
          "Orbit AI launched workflow",

        description:
          input,
      });

      executed.push(
        `Workflow executed: ${input}`
      );
    }

    // COMPLETE

    setCurrentThought(
      "Orbit AI execution completed."
    );

    return executed;
  } catch (error) {
    console.error(error);

    return [];
  } finally {
    setTimeout(() => {
      setThinking(
        false
      );

      setCurrentThought(
        ""
      );
    }, 900);
  }
}