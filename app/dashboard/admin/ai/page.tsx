import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getAIUsageStats } from "@/server/actions/admin/getAIUsageStats";
import AIOperationsDashboard from "@/components/admin/AIOperationsDashboard";

async function assertPlatformAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("platform_role")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.platform_role === "admin";
}

export default async function AIOperationsPage() {
  const isAdmin = await assertPlatformAdmin();
  if (!isAdmin) redirect("/dashboard");

  const stats = await getAIUsageStats();

  return (
    <div className="px-6 py-8 lg:px-8">
      <AIOperationsDashboard stats={stats} />
    </div>
  );
}
