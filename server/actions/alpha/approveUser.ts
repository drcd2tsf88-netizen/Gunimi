"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { sendAlphaWelcome } from "@/lib/email/sendAlphaWelcome";
import { logger } from "@/lib/logger";

export async function approveUser(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { data: caller } = await supabaseAdmin
    .from("profiles")
    .select("platform_role")
    .eq("id", user.id)
    .maybeSingle();

  if (!["admin", "team"].includes(caller?.platform_role ?? "")) {
    return { success: false, error: "Forbidden" };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({ platform_role: "beta" })
    .eq("id", userId)
    .select("full_name")
    .maybeSingle();

  if (profileError) {
    logger.error("approveUser: profile update failed", { userId, error: profileError.message });
    return { success: false, error: "Failed to update role" };
  }

  const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
  const email = authUser?.user?.email;

  if (email) {
    try {
      await sendAlphaWelcome({
        email,
        name: (profile as { full_name?: string } | null)?.full_name ?? "",
      });
    } catch (err) {
      logger.error("approveUser: welcome email failed", { userId, error: String(err) });
    }
  }

  revalidatePath("/dashboard/admin/alpha");
  return { success: true };
}
