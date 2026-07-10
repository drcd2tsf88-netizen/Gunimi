import { APP_CONFIG } from "@/lib/config/app";
import { sendEmail } from "./provider";

type ContactEmailPayload = {
  name: string;
  email: string;
  category: string;
  message: string;
};

export async function sendContactEmail({
  name,
  email,
  category,
  message,
}: ContactEmailPayload): Promise<void> {
  await sendEmail({
    from: APP_CONFIG.email.from,
    to: APP_CONFIG.email.support,
    replyTo: email,
    subject: `[Contact] ${category} — ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nCategory: ${category}\n\n${message}`,
  });
}
