type HistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

type GenerateOrbitResponseProps = {
  input: string;
  agent: { name: string };
  history?: HistoryMessage[];
};

type OrbitResponse = {
  response: string;
  generatedActions: string[];
  generatedTimeline: string[];
  generatedMemory: string[];
};

export async function generateOrbitResponse(
  props: GenerateOrbitResponseProps,
  onToken?: (token: string) => void
): Promise<OrbitResponse> {
  const { input, agent, history } = props;

  try {
    const res = await fetch("/api/orbit-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
        agent: agent.name,
        history: history ?? [],
      }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`orbit-assistant returned ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let generatedActions: string[] = [];
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data) as { t?: string; a?: string[] };
          if (parsed.t) {
            fullText += parsed.t;
            onToken?.(parsed.t);
          }
          if (parsed.a) {
            generatedActions = parsed.a;
          }
        } catch {
          // malformed SSE chunk — skip
        }
      }
    }

    return {
      response: fullText || "Gunimi AI could not generate a response.",
      generatedActions,
      generatedTimeline: [],
      generatedMemory: [],
    };
  } catch {
    return {
      response: "Gunimi AI encountered an error while processing your request.",
      generatedActions: [],
      generatedTimeline: [],
      generatedMemory: [],
    };
  }
}
