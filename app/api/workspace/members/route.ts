import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspaceId = req.nextUrl.searchParams.get("workspace_id");
  if (!workspaceId) {
    return NextResponse.json({ error: "Missing workspace_id" }, { status: 400 });
  }

  // Verify requesting user is actually a member of this workspace
  const { data: myMembership } = await supabaseAdmin
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!myMembership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Fetch all members with profile data (service role bypasses FK/RLS)
  const { data: memberships, error } = await supabaseAdmin
    .from("workspace_members")
    .select("id, role, user_id")
    .eq("workspace_id", workspaceId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const userIds = (memberships || []).map((m) => m.user_id);

  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, avatar_url, email, full_name")
    .in("id", userIds);

  const profileMap = Object.fromEntries(
    (profiles || []).map((p) => [p.id, p])
  );

  const members = (memberships || []).map((m) => ({
    id: m.id,
    role: m.role,
    profiles: profileMap[m.user_id] ?? null,
  }));

  return NextResponse.json({ members });
}
