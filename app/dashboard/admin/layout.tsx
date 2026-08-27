import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import AdminNav from "@/components/admin/AdminNav";

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

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await assertPlatformAdmin();
  if (!isAdmin) redirect("/dashboard");

  return (
    <div className="flex min-h-screen">
      {/* Left sidebar */}
      <aside className="w-52 shrink-0 border-r border-white/[0.05] bg-white/[0.01] px-3 py-6">
        <AdminNav />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 px-6 py-8 lg:px-10">
        {children}
      </main>
    </div>
  );
}
