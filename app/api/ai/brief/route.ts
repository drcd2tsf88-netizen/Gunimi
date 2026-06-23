import { getUser } from "@/lib/server/auth";
import { ratelimit } from "@/lib/ratelimit";
import { errorResponse } from "@/lib/server/apiResponse";
import { getWorkspaceContext } from "@/server/actions/ai/getWorkspaceContext";
import { generateDailyBrief } from "@/server/actions/ai/generateDailyBrief";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();
  if (!user) return errorResponse("Unauthorized", 401);

  const { success } = await ratelimit.limit(user.id);
  if (!success) return errorResponse("Rate limit exceeded", 429);

  try {
    const ctx = await getWorkspaceContext();

    if (!ctx) {
      return NextResponse.json(
        { summary: "", priorities: [], risks: [], opportunities: [] },
        { headers: { "Cache-Control": "private, max-age=60" } }
      );
    }

    const brief = await generateDailyBrief(ctx);

    return NextResponse.json(
      brief ?? { summary: "", priorities: [], risks: [], opportunities: [] },
      { headers: { "Cache-Control": "private, max-age=300" } }
    );
  } catch (error) {
    console.error("ai/brief error:", error);
    return errorResponse("AI request failed");
  }
}

export async function POST() {
  return errorResponse("Method not allowed", 405);
}
