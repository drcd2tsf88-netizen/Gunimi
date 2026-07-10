"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";

type UpdateProfileInput = {
  full_name: string;
};

export async function updateUserProfile(input: UpdateProfileInput): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;
    if (!await checkWriteRateLimit(user.id)) return false;

    const trimmed = input.full_name.trim();
    if (!trimmed) return false;

    const supabase = await createClient();

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: trimmed })
      .eq("id", user.id);

    if (error) {
      logger.error("updateUserProfile error:", error);
      return false;
    }

    revalidatePath("/dashboard/settings");
    return true;
  } catch {
    return false;
  }
}
