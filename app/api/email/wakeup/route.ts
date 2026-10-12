import { getUser } from "@/lib/server/auth";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { generateEmailConnectionWakeup } from "@/server/actions/crm/generateEmailConnectionWakeup";
import { errorResponse } from "@/lib/server/apiResponse";
import { NextResponse } from "next/server";
import { ratelimit } from "@/lib/ratelimit";

export async function POST() {
  try {
    const user = await getUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const { success } = await ratelimit.limit(user.id);
    if (!success) return errorResponse("Rate limit exceeded", 429);

    const workspace = await getCurrentWorkspace();
    if (!workspace) return errorResponse("Workspace not found", 404);

    await generateEmailConnectionWakeup({ workspaceId: workspace.id });

    return NextResponse.json({ success: true });
  } catch {
    return errorResponse("Server error", 500);
  }
}
