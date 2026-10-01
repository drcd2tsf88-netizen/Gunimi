"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { sendVerificationEmail } from "@/lib/email/sendVerificationEmail";

type Result = { success: true } | { error: string };

export async function resendVerificationEmail(email: string): Promise<Result> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return { error: "resendFailed" };

  try {
    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/register/complete`;

    // Check user exists and is unconfirmed
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const user = users?.users?.find(
      (u) => u.email?.toLowerCase() === normalized && !u.email_confirmed_at,
    );

    if (!user) {
      // Don't reveal whether email exists — return success silently
      return { success: true };
    }

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email: normalized,
      password: "",
      options: { redirectTo },
    });

    if (linkError || !linkData?.properties?.action_link) {
      return { error: "resendFailed" };
    }

    await sendVerificationEmail({
      email: normalized,
      name: (user.user_metadata?.full_name as string | undefined) ?? "",
      verificationUrl: linkData.properties.action_link,
    });

    return { success: true };
  } catch {
    return { error: "resendFailed" };
  }
}
