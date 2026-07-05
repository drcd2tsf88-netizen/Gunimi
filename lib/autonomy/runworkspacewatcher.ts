import { supabase }
from "@/lib/supabase";

import { createActivity }
from "@/server/actions/activity/createActivity";

import { createMemory }
from "@/server/actions/memory/createMemory";

import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";
import { setWorkspaceAIState } from "@/server/actions/ai/setWorkspaceAIState";
import { createAIAction }
from "@/server/actions/ai/createAIAction";
 

export async function runWorkspaceWatcher() {
  try {
    // CURRENT WORKSPACE

    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return false;
    }

    // TASKS

    const {
      data: tasks,
      error: tasksError,
    } = await supabase
      .from(
        "workspace_tasks"
      )
      .select("*")
      .eq(
        "workspace_id",
        workspace.id
      );

    if (tasksError) {
      return false;
    }

    // CONTACTS

    const {
      data: contacts,
      error: contactsError,
    } = await supabase
      .from(
        "workspace_contacts"
      )
      .select("*")
      .eq(
        "workspace_id",
        workspace.id
      );

    if (contactsError) {
      return false;
    }

    // OVERDUE HIGH PRIORITY TASKS

    const overdueTasks =
      tasks?.filter(
        (task) =>
          task.status !==
            "completed" &&
          task.priority ===
            "high"
      ) ?? [];

    // CRITICAL WORKLOAD SIGNAL

    if (
      overdueTasks.length >= 3
    ) {
      await setWorkspaceAIState({
  state:
    "critical_overload",

  context:
    "Gunimi AI detected elevated high-priority workload pressure.",
});
     
      await createActivity({
        type:
          "ai_signal",

        title:
          "Gunimi AI detected critical task overload",

        description: `
          ${overdueTasks.length}
          high-priority tasks
          require immediate
          attention.
        `,
      });

      await createMemory({
        type:
          "workspace_insight",

        content:
          "Gunimi AI detected critical high-priority workload pressure.",
      });
    }
    await createAIAction({
  title:
    "Resolve critical workload pressure",

  description:
    "Gunimi AI recommends resolving elevated high-priority tasks to stabilize workspace execution systems.",

  action_label:
    "Open Tasks",

  action_route:
    "/dashboard/tasks",

  priority:
    "high",
});

    // EMPTY CRM SIGNAL

    if (
      !contacts ||
      contacts.length === 0
    ) {
      await setWorkspaceAIState({
  state:
    "crm_inactive",

  context:
    "Gunimi AI detected inactive CRM pipeline.",
});
      await createActivity({
        type:
          "ai_signal",

        title:
          "CRM pipeline inactive",

        description:
          "Gunimi AI detected no active customer records inside workspace CRM.",
      });

      await createMemory({
        type:
          "crm_insight",

        content:
          "Gunimi AI detected inactive CRM pipeline with no active customer records.",
      });
    }
    await setWorkspaceAIState({
  state:
    "workspace_stable",

  context:
    "Gunimi AI monitoring workspace systems.",
});
    await createAIAction({
  title:
    "Initialize CRM recovery workflow",

  description:
    "Gunimi AI detected inactive CRM systems and recommends rebuilding customer engagement pipelines.",

  action_label:
    "Open CRM",

  action_route:
    "/dashboard/contacts",

  priority:
    "medium",
});
    return true;
  } catch {
    return false;
  }
}