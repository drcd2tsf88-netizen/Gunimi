import { getEmailClient } from "./client";
import type { EmailPayload } from "./types";

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const client = getEmailClient();
  await client.sendEmail({
    From: payload.from,
    To: Array.isArray(payload.to) ? payload.to.join(",") : payload.to,
    Subject: payload.subject,
    HtmlBody: payload.html,
    TextBody: payload.text,
    ReplyTo: payload.replyTo,
    MessageStream: "outbound",
  });
}
