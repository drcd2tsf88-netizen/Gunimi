import { NextResponse } from "next/server";

import { cookies } from "next/headers";

import { createServerClient }
from "@supabase/ssr";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";

import { ratelimit } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const { token } =
      body;

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Token required",
        },
        {
          status: 400,
        }
      );
    }

    const cookieStore =
      await cookies();

    const supabase =
      createServerClient(
        process.env
          .NEXT_PUBLIC_SUPABASE_URL!,

        process.env
          .NEXT_PUBLIC_SUPABASE_ANON_KEY!,

        {
          cookies: {
            get(name) {
              return cookieStore.get(
                name
              )?.value;
            },
          },
        }
      );

    // USER

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { success: rateLimitOk } = await ratelimit.limit(user.id);
    if (!rateLimitOk) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    // INVITE — use supabaseAdmin so non-members can read their own invite

    const {
      data: invite,

      error:
        inviteError,
    } =
      await supabaseAdmin
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
      inviteError ||
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

    // STATUS

    if (
      invite.status !==
      "pending"
    ) {
      return NextResponse.json(
        {
          error:
            "Invite already used",
        },
        {
          status: 400,
        }
      );
    }

    // EXPIRED

    if (
      new Date(
        invite.expires_at
      ) < new Date()
    ) {
      return NextResponse.json(
        {
          error:
            "Invite expired",
        },
        {
          status: 400,
        }
      );
    }

    // EMAIL CHECK

    if (
      user.email
        ?.toLowerCase() !==
      invite.email
        ?.toLowerCase()
    ) {
      return NextResponse.json(
        {
          error:
            "Wrong account",
        },
        {
          status: 403,
        }
      );
    }

    // MEMBERSHIP EXISTS

    const {
      data:
        existingMembership,
    } =
      await supabase
        .from(
          "workspace_members"
        )
        .select("id")
        .eq(
          "workspace_id",
          invite.workspace_id
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

    if (
      existingMembership
    ) {
      return NextResponse.json(
        {
          error:
            "Already a member",
        },
        {
          status: 400,
        }
      );
    }

    // CREATE MEMBERSHIP

    const {
      error:
        membershipError,
    } =
      await supabase
        .from(
          "workspace_members"
        )
        .insert({
          workspace_id:
            invite.workspace_id,

          user_id:
            user.id,

          role:
            invite.role,
        });

    if (
      membershipError
    ) {
      logger.error("Membership creation failed", membershipError);

      return NextResponse.json(
        {
          error:
            "Membership creation failed",
        },
        {
          status: 500,
        }
      );
    }

    await supabaseAdmin
      .from("workspace_activity")
      .insert({
        workspace_id:
          invite.workspace_id,

        user_id:
          user.id,

        type:
          "member_joined",

        title:
          "New member joined",

        description:
          `${user.email} joined the workspace`,

        metadata: {
          role:
            invite.role,
        },
      });
    // CONSUME INVITE — use supabaseAdmin (email-match RLS would block the user client)

    await supabaseAdmin
      .from(
        "workspace_invites"
      )
      .update({
        status:
          "accepted",

        accepted_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        invite.id
      );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    logger.error("Invite accept failed", error);

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