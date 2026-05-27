

export type OrbitAgent =
  | "strategist"
  | "operator"
  | "analyst"
  | "crm";

export function routeAgent(
  message: string
): OrbitAgent {
  const lowerMessage =
    message.toLowerCase();

  // CRM

  if (
    lowerMessage.includes("crm") ||
    lowerMessage.includes("lead") ||
    lowerMessage.includes("pipeline") ||
    lowerMessage.includes("customer") ||
    lowerMessage.includes("sales")
  ) {
    return "crm";
  }

  // ANALYTICS

  if (
    lowerMessage.includes(
      "analyze"
    ) ||
    lowerMessage.includes(
      "analytics"
    ) ||
    lowerMessage.includes(
      "report"
    ) ||
    lowerMessage.includes(
      "insights"
    ) ||
    lowerMessage.includes(
      "productivity"
    )
  ) {
    return "analyst";
  }

  // OPERATIONS

  if (
    lowerMessage.includes("task") ||
    lowerMessage.includes(
      "workflow"
    ) ||
    lowerMessage.includes(
      "execute"
    ) ||
    lowerMessage.includes("plan")
  ) {
    return "operator";
  }

  // DEFAULT

  return "strategist";
}