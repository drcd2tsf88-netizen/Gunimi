import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import SentryExampleClient from "@/components/sentry/SentryExampleClient";

export const metadata: Metadata = {
  title: "Sentry Example",
  robots: { index: false, follow: false },
};

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

export default async function SentryExamplePage() {
  const allowed = await assertPlatformTeam();
  if (!allowed) redirect("/dashboard");

  return <SentryExampleClient />;
}
