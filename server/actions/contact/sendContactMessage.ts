"use server";

import { Resend } from "resend";
import { APP_CONFIG } from "@/lib/config/app";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    await resend.emails.send({
      from: APP_CONFIG.email.from,
      to: APP_CONFIG.email.support,
      replyTo: e,
      subject: `[Contact] ${category} — ${n}`,
      text: `Name: ${n}\nEmail: ${e}\nCategory: ${category}\n\n${m}`,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to send message. Please try again." };
  }
}
