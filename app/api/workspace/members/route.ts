import { createClient }
from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase =
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const workspaceId =
      searchParams.get(
        "workspace_id"
      );

    if (!workspaceId) {
      return NextResponse.json(
        {
          error:
            "workspace_id required",
        },
        {
          status: 400,
        }
      );
    }

   const {
  data,
  error,
} = await supabase
  .from(
    "workspace_members"
  )
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
  .eq(
    "workspace_id",
    workspaceId
  );

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error:
            "Failed to load members",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      members:
        data || [],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}