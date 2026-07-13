import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getFeedback } from "@/server/actions/dogfood/getFeedback";
import { getFirstSuccess } from "@/server/actions/dogfood/getFirstSuccess";
import DogfoodDashboard from "@/components/admin/DogfoodDashboard";

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

export default async function DogfoodPage() {
  const allowed = await assertPlatformTeam();
  if (!allowed) redirect("/dashboard");

  const [feedback, metrics] = await Promise.all([
    getFeedback(),
    getFirstSuccess(),
  ]);

  return (
    <div className="px-6 py-8 lg:px-8">
      <DogfoodDashboard feedback={feedback} metrics={metrics} />
    </div>
  );
}
