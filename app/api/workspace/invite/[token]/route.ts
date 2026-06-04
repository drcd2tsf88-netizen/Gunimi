import { NextResponse } from "next/server";

import { createClient }
from "@supabase/supabase-js";


  export async function GET(
  request: Request,

  {
    params,
  }: {
    params: Promise<{
      token: string;
    }>;
  }
) {
  const { token } = await params;

  try {
    const supabase =
      createClient(
        process.env
          .NEXT_PUBLIC_SUPABASE_URL!,

        process.env
          .SUPABASE_SERVICE_ROLE_KEY!
      );

    const {
      data: invite,

      error,
    } =
      await supabase
        .from(
          "workspace_invites"
        )
        .select("*")
        .eq(
          "token",
          token
        )
        .maybeSingle();

    if (
      error ||
      !invite
    ) {
      return NextResponse.json(
        {
          error:
            "Invite not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      invite,
    });
  } catch (error) {
    console.error(
      "INVITE LOAD ERROR",
      error
    );

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