"use server";

import { sendContactEmail } from "@/lib/email";

type ContactPayload = {
  name: string;
  email: string;
  category: string;
  message: string;
};

export async function sendContactMessage({
  name,
  email,
  category,
  message,
}: ContactPayload): Promise<{ ok: boolean; error?: string }> {
  const n = name?.trim();
  const e = email?.trim().toLowerCase();
  const m = message?.trim();

  if (!n || !e || !m) return { ok: false, error: "Missing required fields" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return { ok: false, error: "Invalid email address" };
  if (n.length > 120) return { ok: false, error: "Name too long" };
  if (m.length > 2000) return { ok: false, error: "Message too long (max 2000 characters)" };

  try {
    await sendContactEmail({ name: n, email: e, category, message: m });
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to send message. Please try again." };
  }
}
