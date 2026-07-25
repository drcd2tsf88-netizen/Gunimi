"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { sendVerificationEmail } from "@/lib/email/sendVerificationEmail";
import { sendAdminRegistrationAlert } from "@/lib/email/sendAdminRegistrationAlert";

// Disposable email blocklist — server-side mirror; client copy is UX-only
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com","guerrillamail.com","tempmail.com","throwaway.email",
  "yopmail.com","sharklasers.com","guerrillamailblock.com","grr.la",
  "guerrillamail.info","guerrillamail.biz","guerrillamail.de","guerrillamail.net",
  "guerrillamail.org","spam4.me","trashmail.com","trashmail.me","trashmail.net",
  "dispostable.com","mailnull.com","spamgourmet.com","spamgourmet.net",
  "maildrop.cc","discard.email","fakeinbox.com","tempinbox.com",
  "10minutemail.com","10minutemail.net","20minutemail.com","mailnesia.com",
  "mytemp.email","temp-mail.org","emailondeck.com","getairmail.com",
  "spamfree24.org","trashmail.at","trashmail.io","spamherelots.com",
  "throwam.com","tempsky.com","spambox.us","inboxalias.com","filzmail.com",
]);

function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1] ?? "";
  return DISPOSABLE_DOMAINS.has(domain);
}

function isPasswordStrong(pwd: string): boolean {
  return (
    pwd.length >= 8 &&
    /[A-Z]/.test(pwd) &&
    /[a-z]/.test(pwd) &&
    /[0-9]/.test(pwd) &&
    /[^A-Za-z0-9]/.test(pwd)
  );
}

type Result = { success: true } | { error: string };

export async function registerUser(
  email: string,
  password: string,
  fullName: string,
): Promise<Result> {
  const normalized = email.trim().toLowerCase();
  const name = fullName.trim();

  if (isDisposableEmail(normalized)) return { error: "disposableEmail" };
  if (!isPasswordStrong(password)) return { error: "passwordTooWeak" };

  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/register/complete`;

  // generateLink with type "signup" creates the user and produces a one-time
  // verification link in one atomic call — no separate createUser step needed.
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: "signup",
    email: normalized,
    password,
    options: {
      redirectTo,
      data: { full_name: name },
    },
  });

  if (linkError) {
    const msg = linkError.message?.toLowerCase() ?? "";
    if (msg.includes("already registered") || msg.includes("already been registered")) {
      return { error: "emailAlreadyInUse" };
    }
    return { error: "registerFailed" };
  }

  if (!linkData?.properties?.action_link) {
    return { error: "registerFailed" };
  }

  try {
    await sendVerificationEmail({
      email: normalized,
      name,
      verificationUrl: linkData.properties.action_link,
    });
  } catch {
    return { error: "registerFailed" };
  }

  // Fire-and-forget — admin alert must not block or fail the registration
  sendAdminRegistrationAlert({ name, email: normalized }).catch(() => undefined);

  return { success: true };
}
