import { createClient }
from "@supabase/supabase-js";

import { NextResponse }
from "next/server";

import { getUser }
from "@/lib/server/auth";

import { ratelimit } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request
) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { success } = await ratelimit.limit(user.id);
  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  try {
    const { searchParams } =
      new URL(request.url);

    const workspaceId =
      searchParams.get("workspace_id");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspace_id required" },
        { status: 400 }
      );
    }

    const { data: membership } =
      await supabase
        .from("workspace_members")
        .select("id")
        .eq("workspace_id", workspaceId)
        .eq("user_id", user.id)
        .single();

    if (!membership) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { data, error } =
      await supabase
        .from("workspace_members")
        .select(`
          id,
          role,
          user_id,
          profiles (
            id,
            email,
            full_name,
            avatar_url,
            status
          )
        `)
        .eq("workspace_id", workspaceId);

    if (error) {
      logger.error("Failed to load workspace members", error);

      return NextResponse.json(
        { error: "Failed to load members" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      members: data || [],
    });
  } catch (error) {
    logger.error("Workspace members route failed", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
