type BuildOrbitContextProps = {
  messages: {
    role: string;

    content: string;

    metadata?: {
      agent?: string;
    };
  }[];

  aiMemory: string[];

  workflowTimeline: string[];

  activeAgent: string;

  workspaceContext: {
    workspaceName?: string;

    activeTasks: number;

    overdueTasks: number;

    crmLeads: number;

    aiActions: number;

    productivity: string;
  };
};

export function buildOrbitContext({
  messages,

  aiMemory,

  workflowTimeline,

  activeAgent,

  workspaceContext,
}: BuildOrbitContextProps) {
  const recentMessages =
    messages
      .slice(-6)
      .map(
        (msg) =>
          `${msg.role.toUpperCase()} (${msg.metadata?.agent ?? "Orbit Core"}):

${msg.content}`
      )
      .join("\n\n");

  const memoryContext =
    aiMemory.join("\n");

  const workflowContext =
    workflowTimeline.join("\n");

  return `
ORBIT AI SYSTEM CONTEXT

WORKSPACE:
${workspaceContext.workspaceName ?? "Orbit Workspace"}

ACTIVE AGENT:
${activeAgent}

WORKSPACE STATUS:

• Active Tasks:
${workspaceContext.activeTasks}

• Overdue Tasks:
${workspaceContext.overdueTasks}

• CRM Leads:
${workspaceContext.crmLeads}

• AI Actions Today:
${workspaceContext.aiActions}

• Productivity:
${workspaceContext.productivity}

AI MEMORY:
${memoryContext}

WORKFLOW TIMELINE:
${workflowContext}

RECENT CONVERSATION:
${recentMessages}

SYSTEM DIRECTIVE:
Orbit AI is an intelligent business operating system focused on operational clarity, workflow execution, AI orchestration, analytics, CRM intelligence, and strategic productivity enhancement.
`;
}