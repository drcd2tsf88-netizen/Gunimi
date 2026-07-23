import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import AlphaDashboard from "@/components/admin/AlphaDashboard";

async function assertPlatformTeam(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("platform_role")
    .eq("id", user.id)
    .maybeSingle();
  return ["admin", "team"].includes(profile?.platform_role ?? "");
}

type PendingUser = {
  id: string;
  full_name: string | null;
  email: string;
  created_at: string;
};

async function getPendingUsers(): Promise<PendingUser[]> {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, email, created_at")
    .eq("platform_role", "user")
    .order("created_at", { ascending: true });
  return (data ?? []) as PendingUser[];
}

export default async function AlphaAdminPage() {
  const allowed = await assertPlatformTeam();
  if (!allowed) redirect("/dashboard");

  const pending = await getPendingUsers();

  return (
    <div className="px-6 py-8 lg:px-8">
      <AlphaDashboard pending={pending} />
    </div>
  );
}
