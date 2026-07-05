export function routeAgent(input: string) {
  const lower = input.toLowerCase();

  if (
    lower.includes("deal") ||
    lower.includes("pipeline") ||
    lower.includes("revenue") ||
    lower.includes("close") ||
    lower.includes("stage") ||
    lower.includes("opportunity")
  ) {
    return { name: "Deals Agent" };
  }

  if (
    lower.includes("task") ||
    lower.includes("todo") ||
    lower.includes("overdue") ||
    lower.includes("deadline") ||
    lower.includes("priority")
  ) {
    return { name: "Task Agent" };
  }

  if (
    lower.includes("contact") ||
    lower.includes("lead") ||
    lower.includes("prospect") ||
    lower.includes("relationship") ||
    lower.includes("company") ||
    lower.includes("companies") ||
    lower.includes("account") ||
    lower.includes("crm")
  ) {
    return { name: "CRM Agent" };
  }

  if (
    lower.includes("meeting") ||
    lower.includes("calendar") ||
    lower.includes("schedule") ||
    lower.includes("event")
  ) {
    return { name: "Calendar Agent" };
  }

  if (
    lower.includes("email") ||
    lower.includes("inbox") ||
    lower.includes("thread") ||
    lower.includes("unread")
  ) {
    return { name: "Email Agent" };
  }

  if (
    lower.includes("analytic") ||
    lower.includes("report") ||
    lower.includes("metric") ||
    lower.includes("performance") ||
    lower.includes("insight") ||
    lower.includes("growth")
  ) {
    return { name: "Analytics Agent" };
  }

  return { name: "Gunimi AI" };
}