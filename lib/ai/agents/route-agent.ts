export function routeAgent(
  input: string
) {
  const lower =
    input.toLowerCase();

  if (
    lower.includes("task")
  ) {
    return {
      name:
        "Task Agent",
    };
  }

  if (
    lower.includes("crm")
  ) {
    return {
      name:
        "CRM Agent",
    };
  }

  return {
    name:
      "Orbit Core",
  };
}