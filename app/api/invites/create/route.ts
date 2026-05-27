import {
  NextResponse,
} from "next/server";

import {
  createServerClient,
} from "@supabase/ssr";

import {
  cookies,
} from "next/headers";

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
            get(name: string) {
              return cookieStore.get(
                name
              )?.value;
            },
          },
        }
      );

    // AUTH USER

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

    // MEMBERSHIP VALIDATION

    const {
      data: membership,
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
      !membership ||
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

    // DUPLICATE INVITE CHECK

    const {
      data:
        existingInvite,
    } =
      await supabase
        .from(
          "workspace_invites"
        )
        .select("*")
        .eq(
          "workspace_id",
          workspaceId
        )
        .eq(
          "email",
          email
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

    // TOKEN

    const token =
      crypto.randomUUID();

    // EXPIRES

    const expiresAt =
      new Date(
        Date.now() +
          1000 *
            60 *
            60 *
            24 *
            7
      );

    // INSERT INVITE

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

          email,

          role,

          token,

          expires_at:
            expiresAt.toISOString(),
        })
        .select()
        .single();

    if (
      inviteError
    ) {
      console.error(
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

    // TODO:
    // SEND ORBIT EMAIL

    return NextResponse.json(
      {
        success: true,

        invite,
      }
    );
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