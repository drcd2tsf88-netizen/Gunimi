import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const FOUNDER_EMAIL = "guoth123@gmail.com";

export default async function FounderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== FOUNDER_EMAIL) {
    redirect("/login");
  }

  return (
    <div className="min-h-dvh bg-[#020305] text-white font-mono">
      {children}
    </div>
  );
}
