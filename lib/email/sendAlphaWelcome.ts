import { APP_CONFIG } from "@/lib/config/app";
import { sendEmail } from "./provider";

type Props = {
  email: string;
  name: string;
};

export async function sendAlphaWelcome({ email, name }: Props): Promise<void> {
  const checkUrl = `${process.env.NEXT_PUBLIC_APP_URL}/waitlist`;
  const displayName = name || "there";

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark light" />
  <title>Your Open Alpha access is ready</title>
  <style>
    body { margin: 0; padding: 0; background-color: #05060A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    @media (prefers-color-scheme: light) {
      body { background-color: #f5f5f5 !important; }
      .card { background-color: #ffffff !important; border-color: #e5e7eb !important; }
      .heading { color: #111827 !important; }
      .body-text { color: #374151 !important; }
      .footer-text { color: #9ca3af !important; }
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

                <!-- Badge -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="background-color:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:20px;padding:4px 12px;">
                      <span style="font-size:11px;font-weight:600;color:#22c55e;letter-spacing:0.12em;text-transform:uppercase;">Open Alpha Access</span>
                    </td>
                  </tr>
                </table>

                <!-- Heading -->
                <h1 class="heading" style="margin:24px 0 12px;font-size:26px;font-weight:700;color:#F7F8FC;letter-spacing:-0.03em;line-height:1.2;">
                  Hi ${displayName},<br />your workspace is ready.
                </h1>

                <!-- Body -->
                <p class="body-text" style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#9AA3B2;">
                  You've been approved for <strong style="color:#F7F8FC;">Gunimi Open Alpha</strong>. Your workspace is now waiting for you.<br /><br />
                  Click the button below to activate it and start building.
                </p>

                <!-- CTA -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="border-radius:12px;background:linear-gradient(135deg,#6D5BFF,#5B4AE8);box-shadow:0 0 24px rgba(109,91,255,0.35);">
                      <a href="${checkUrl}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;letter-spacing:-0.01em;">
                        Activate my workspace &rarr;
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Divider -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:32px 0;">
                  <tr>
                    <td style="border-top:1px solid rgba(255,255,255,0.05);font-size:0;line-height:0;">&nbsp;</td>
                  </tr>
                </table>

                <p style="margin:0;font-size:12px;color:rgba(154,163,178,0.5);line-height:1.5;">
                  This email was sent to <strong>${email}</strong>. If you have questions, reply directly to this email.
                </p>

                <p style="margin:16px 0 0;font-size:11px;color:rgba(154,163,178,0.35);word-break:break-all;line-height:1.4;">
                  If the button doesn't work, copy this link: <a href="${checkUrl}" style="color:rgba(109,91,255,0.6);text-decoration:none;">${checkUrl}</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:rgba(154,163,178,0.35);line-height:1.5;">
                Gunimi &mdash; AI Workspace OS<br />
                <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:rgba(109,91,255,0.45);text-decoration:none;">${process.env.NEXT_PUBLIC_APP_URL}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hi ${displayName},

Your Gunimi Open Alpha access is ready.

You've been approved. Click the link below to activate your workspace:
${checkUrl}

Questions? Reply directly to this email.

---
Gunimi — AI Workspace OS
${process.env.NEXT_PUBLIC_APP_URL}`;

  await sendEmail({
    from: APP_CONFIG.email.from,
    to: email,
    subject: "Your Gunimi workspace is ready",
    html,
    text,
  });
}
