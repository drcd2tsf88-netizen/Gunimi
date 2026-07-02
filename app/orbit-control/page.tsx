import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import OrbitControlView, { type Profile } from "@/components/admin/OrbitControlView";

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
    .single();

  return profile?.platform_role === "admin";
}

export default async function OrbitControlPage() {
  const isAdmin = await assertPlatformAdmin();
  if (!isAdmin) redirect("/dashboard");

  const { data } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return <OrbitControlView initialProfiles={(data ?? []) as Profile[]} />;
}
