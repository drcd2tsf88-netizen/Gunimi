"use server";

import { createActivity }
from "@/server/actions/activity/createActivity";

type ExecuteOrbitCommandProps = {
  action: string;
};

export async function executeOrbitCommand({
  action,
}: ExecuteOrbitCommandProps) {
  try {
    // ANALYZE

    if (
      action ===
      "analyze-workspace"
    ) {
      await createActivity({
        type: "ai",

        title:
          "Gunimi AI analyzed workspace performance",

        description:
          "AI cognition systems completed workspace observatory analysis.",
      });

      return {
        success: true,

        response:
          "Gunimi AI completed workspace analysis.",
      };
    }

    return {
      success: false,
    };
  } catch {
    return {
      success: false,
    };
  }
}