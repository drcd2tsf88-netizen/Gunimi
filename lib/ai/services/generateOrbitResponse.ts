type GenerateOrbitResponseProps = {
  input: string;

  context: string;

  agent: {
    name: string;
  };

  workspaceMemory: string[];

  workspaceContext: {
    activeTasks: number;

    overdueTasks: number;

    crmLeads: number;

    aiActions: number;

    productivity: string;
  };
};

type OrbitResponse = {
  response: string;
  generatedActions: string[];
  generatedTimeline: string[];
  generatedMemory: string[];
};

export async function generateOrbitResponse(
  props: GenerateOrbitResponseProps
): Promise<OrbitResponse> {
  const { input, agent } = props;

  try {
    const res = await fetch("/api/orbit-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, agent: agent.name }),
    });

    if (!res.ok) {
      throw new Error(`orbit-assistant returned ${res.status}`);
    }

    const json = (await res.json()) as { response?: string; actions?: string[] };

    return {
      response: json.response ?? "Orbit AI could not generate a response.",
      generatedActions: json.actions ?? [],
      generatedTimeline: [],
      generatedMemory: [],
    };
  } catch (error) {
    console.error("generateOrbitResponse failed:", error);

    return {
      response: "Orbit AI encountered an error while processing the request.",
      generatedActions: [],
      generatedTimeline: [],
      generatedMemory: [],
    };
  }
}
