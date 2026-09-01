import type { Message } from "postmark";
import { getEmailClient } from "./client";

type Props = {
  email: string;
  name: string;
};

export async function sendWelcomeOnboarding({ email, name }: Props): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.gunimi.com";
  const dashboardUrl = `${appUrl}/dashboard`;
  const firstName = name?.split(" ")[0]?.trim() || "there";
  const sendAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark light" />
  <title>Welcome to Gunimi</title>
  <style>
    body { margin: 0; padding: 0; background-color: #05060A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    @media (prefers-color-scheme: light) {
      body { background-color: #f5f5f5 !important; }
      .card { background-color: #ffffff !important; border-color: #e5e7eb !important; }
      .heading { color: #111827 !important; }
      .body-text { color: #374151 !important; }
    }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .content-pad { padding: 32px 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#05060A;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#05060A;">
    <tr>
      <td style="padding:40px 20px;">
        <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="560" align="center" style="margin:0 auto;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:28px;text-align:center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td>
                    <div style="display:inline-block;width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6D5BFF,#22D3EE);vertical-align:middle;margin-right:10px;"></div>
                    <span style="font-size:18px;font-weight:700;color:#F7F8FC;vertical-align:middle;letter-spacing:-0.02em;">Gunimi</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td class="card" style="background-color:#0A0E17;border:1px solid rgba(255,255,255,0.06);border-radius:20px;overflow:hidden;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(109,91,255,0.4),transparent);"></div>
              <div class="content-pad" style="padding:40px 40px;">

                <!-- Greeting -->
                <h1 class="heading" style="margin:0 0 20px;font-size:24px;font-weight:700;color:#F7F8FC;letter-spacing:-0.03em;line-height:1.25;">
                  Hi ${firstName},
                </h1>

                <!-- Body -->
                <p class="body-text" style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#9AA3B2;">
                  I'm Michal, founder of Gunimi. I don't know exactly how you found us — a friend, a search, or our website — but I'm genuinely glad you did.
                </p>

                <p class="body-text" style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#9AA3B2;">
                  Your workspace is live. Before you dive in, I want to be upfront about where we are:
                </p>

                <!-- Alpha context block -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:22px;">
                  <tr>
                    <td style="background-color:rgba(109,91,255,0.07);border:1px solid rgba(109,91,255,0.14);border-radius:14px;padding:18px 20px;">
                      <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#8B7DFF;letter-spacing:0.12em;text-transform:uppercase;">Open Alpha</p>
                      <p style="margin:0;font-size:14px;line-height:1.65;color:#9AA3B2;">
                        Gunimi is in early Alpha. Most things work well — but some are still being built. You might encounter rough edges, missing features, or the occasional bug. That's the deal in Alpha, and honestly that's why I want you here now — to help us shape it.
                      </p>
                    </td>
                  </tr>
                </table>

                <p class="body-text" style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#9AA3B2;">
                  If something doesn't work — or you have an idea — there's a feedback button built directly into your workspace. Press <strong style="color:#F7F8FC;">?</strong> on your keyboard from anywhere inside Gunimi, or look for the small button in the bottom-left corner of the sidebar. I read every submission during Alpha personally.
                </p>

                <p class="body-text" style="margin:0 0 28px;font-size:15px;line-height:1.75;color:#9AA3B2;">
                  What Gunimi is at its core: contacts, deals, notes, tasks, email, and relationship intelligence — all in one workspace. No switching between six different tools. Your context travels with you.
                </p>

                <!-- CTA -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="border-radius:12px;background:linear-gradient(135deg,#6D5BFF,#5B4AE8);box-shadow:0 0 24px rgba(109,91,255,0.35);">
                      <a href="${dashboardUrl}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;letter-spacing:-0.01em;">
                        Open my workspace &rarr;
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Divider -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:32px 0 24px;">
                  <tr>
                    <td style="border-top:1px solid rgba(255,255,255,0.05);font-size:0;line-height:0;">&nbsp;</td>
                  </tr>
                </table>

                <!-- Sign-off -->
                <p style="margin:0;font-size:14px;line-height:1.75;color:#9AA3B2;">
                  Welcome aboard,<br />
                  <strong style="color:#F7F8FC;">Michal</strong><br />
                  <span style="font-size:12px;color:rgba(154,163,178,0.5);">Founder, Gunimi</span>
                </p>

                <p style="margin:20px 0 0;font-size:12px;color:rgba(154,163,178,0.4);line-height:1.5;">
                  This email was sent to <strong>${email}</strong>. Reply directly and I'll get it.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:rgba(154,163,178,0.35);line-height:1.5;">
                Gunimi &mdash; AI Workspace OS<br />
                <a href="${appUrl}" style="color:rgba(109,91,255,0.45);text-decoration:none;">${appUrl}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hi ${firstName},

I'm Michal, founder of Gunimi. I don't know exactly how you found us — a friend, a search, or our website — but I'm genuinely glad you did.

Your workspace is live. Before you dive in, I want to be upfront about where we are:

OPEN ALPHA
Gunimi is in early Alpha. Most things work well — but some are still being built. You might encounter rough edges, missing features, or the occasional bug. That's the deal in Alpha, and honestly that's why I want you here now — to help us shape it.

If something doesn't work — or you have an idea — there's a feedback button built directly into your workspace. Press "?" on your keyboard from anywhere inside Gunimi, or look for the small button in the bottom-left corner of the sidebar. I read every submission during Alpha personally.

What Gunimi is at its core: contacts, deals, notes, tasks, email, and relationship intelligence — all in one workspace. No switching between six different tools. Your context travels with you.

Open my workspace: ${dashboardUrl}

---
Welcome aboard,
Michal
Founder, Gunimi

${appUrl}`;

  const client = getEmailClient();
  // SendAt is a valid Postmark API parameter for scheduled delivery.
  // It is missing from this SDK version's Message type, so we use a cast.
  await client.sendEmail({
    From: "Michal from Gunimi <hello@gunimi.com>",
    To: email,
    Subject: `You're in, ${firstName} — a note from Michal`,
    HtmlBody: html,
    TextBody: text,
    ReplyTo: "hello@gunimi.com",
    MessageStream: "outbound",
    SendAt: sendAt,
  } as unknown as Message);
}
