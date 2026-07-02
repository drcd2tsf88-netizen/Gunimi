"use server";

import { createClient }
from "@/lib/supabase/server";

import { getUser }
from "@/server/actions/auth/getUser";

type Workspace = {
  id: string;
  name: string;
  slug: string;
};

export async function getUserWorkspaces(): Promise<Workspace[]> {
  try {
    const user = await getUser();

    if (!user) {
      return [];
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_members")
      .select("workspaces(id, name, slug)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("getUserWorkspaces error:", error);
      return [];
    }

    type WorkspaceMemberRow = { workspaces: Workspace[] };
    return (data || [])
      .flatMap((m) => (m as unknown as WorkspaceMemberRow).workspaces ?? []);
  } catch (error) {
    console.error("getUserWorkspaces failed:", error);
    return [];
  }
}
