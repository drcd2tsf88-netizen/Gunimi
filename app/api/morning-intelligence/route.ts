import { getUser } from "@/lib/server/auth";
import { ratelimit } from "@/lib/ratelimit";
import { errorResponse } from "@/lib/server/apiResponse";
import { getWorkspaceContext } from "@/server/actions/ai/getWorkspaceContext";
import { getMorningIntelligence } from "@/server/actions/ai/getMorningIntelligence";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export async function GET() {
  const user = await getUser();
  if (!user) return errorResponse("Unauthorized", 401);

  const { success } = await ratelimit.limit(user.id);
  if (!success) return errorResponse("Rate limit exceeded", 429);

  try {
    const [ctx, workspace] = await Promise.all([
      getWorkspaceContext(),
      getCurrentWorkspace(),
    ]);

    if (!ctx || !workspace) {
      return errorResponse("Workspace context unavailable", 503);
    }

    const intelligence = await getMorningIntelligence(ctx, {
      workspaceId: workspace.id,
      userId: user.id,
    });

    if (!intelligence) {
      return errorResponse("Intelligence generation failed", 500);
    }

    return Response.json(intelligence, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return errorResponse("Morning intelligence failed");
  }
}
