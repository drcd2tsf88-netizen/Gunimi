import { NextResponse } from "next/server";

import { createServerClient }
from "@supabase/ssr";

import { cookies }
from "next/headers";

import { sendWorkspaceInvite }
from "@/lib/email/sendWorkspaceInvites";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";

const ALLOWED_ROLES = [
  "admin",
  "member",
  "viewer",
];

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      workspaceId,
      email,
      role,
    } = body;

    // BASIC VALIDATION

    if (
      !workspaceId ||
      !email ||
      !role
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_ROLES.includes(
        role
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid role",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

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
            get(
              name: string
            ) {
              return cookieStore.get(
                name
              )?.value;
            },
          },
        }
      );

    // AUTH

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

    // MEMBERSHIP

    const {
      data: membership,

      error:
        membershipError,
    } =
      await supabase
        .from(
          "workspace_members"
        )
        .select("*")
        .eq(
          "workspace_id",
          workspaceId
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

    if (
      membershipError ||
      !membership
    ) {
      return NextResponse.json(
        {
          error:
            "Membership not found",
        },
        {
          status: 403,
        }
      );
    }

    // ROLE CHECK

    if (
      ![
        "owner",
        "admin",
      ].includes(
        membership.role
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Insufficient permissions",
        },
        {
          status: 403,
        }
      );
    }

    // DUPLICATE INVITE

    const {
      data:
        existingInvite,
    } =
      await supabase
        .from(
          "workspace_invites"
        )
        .select("id")
        .eq(
          "workspace_id",
          workspaceId
        )
        .eq(
          "email",
          normalizedEmail
        )
        .eq(
          "status",
          "pending"
        )
        .maybeSingle();

    if (
      existingInvite
    ) {
      return NextResponse.json(
        {
          error:
            "Invite already exists",
        },
        {
          status: 400,
        }
      );
    }

    // MEMBER CHECK

    const {
      data:
        existingUser,
    } =
      await supabase
        .from("profiles")
        .select("id")
        .eq(
          "email",
          normalizedEmail
        )
        .maybeSingle();

    if (
      existingUser
    ) {
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
            workspaceId
          )
          .eq(
            "user_id",
            existingUser.id
          )
          .maybeSingle();

      if (
        existingMembership
      ) {
        return NextResponse.json(
          {
            error:
              "User is already a workspace member",
          },
          {
            status: 400,
          }
        );
      }
    }

    // TOKEN

    const token =
      crypto.randomUUID();

    // EXPIRES

    const expiresAt =
      new Date(
        Date.now() +
          7 *
            24 *
            60 *
            60 *
            1000
      );

    // CREATE INVITE

    const {
      data: invite,

      error:
        inviteError,
    } =
      await supabase
        .from(
          "workspace_invites"
        )
        .insert({
          workspace_id:
            workspaceId,

          invited_by:
            user.id,

          email:
            normalizedEmail,

          role,

          token,

          status:
            "pending",

          expires_at:
            expiresAt.toISOString(),
        })
        .select()
        .single();

    if (
      inviteError
    ) {
      console.error(
        "INVITE ERROR",
        inviteError
      );

      return NextResponse.json(
        {
          error:
            "Failed to create invite",
        },
        {
          status: 500,
        }
      );
    }

await sendWorkspaceInvite({
  email:
    normalizedEmail,

  workspaceName:
    "Orbit Workspace",

  role,

  token,
});

    await supabaseAdmin
      .from("workspace_activity")
      .insert({
        workspace_id: workspaceId,
        user_id: user.id,
        type: "invite_sent",
        title: "Invitation Sent",
        description: `Invited ${normalizedEmail} to workspace`,
      });

    return NextResponse.json({
      success: true,

      invite,
    });
  } catch (error) {
    console.error(
      "INVITE ROUTE ERROR",
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