import { sendEmail } from "./provider";

type Props = {
  email: string;
  ip: string;
  attempts: number;
  timestamp: string;
};

const FOUNDER_EMAIL = "guoth123@gmail.com";

export async function sendSecurityAlert({ email, ip, attempts, timestamp }: Props): Promise<void> {
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><title>Security Alert</title></head>
<body style="margin:0;padding:0;background:#05060A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#05060A;">
    <tr><td style="padding:32px 20px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="520" align="center" style="margin:0 auto;">

        <tr><td style="padding-bottom:20px;">
          <span style="font-size:16px;font-weight:700;color:#F7F8FC;letter-spacing:-0.02em;">Gunimi</span>
          <span style="font-size:12px;color:#9AA3B2;margin-left:8px;">Security Alert</span>
        </td></tr>

        <tr><td style="background:#0A0E17;border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;">
          <div style="height:2px;background:linear-gradient(90deg,transparent,rgba(239,68,68,0.6),transparent);"></div>
          <div style="padding:28px 32px;">

            <div style="display:inline-block;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:20px;padding:3px 10px;margin-bottom:18px;">
              <span style="font-size:10px;font-weight:600;color:#ef4444;letter-spacing:0.12em;text-transform:uppercase;">Failed login attempts</span>
            </div>

            <h1 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#F7F8FC;letter-spacing:-0.02em;">
              Multiple failed logins detected.
            </h1>

            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid rgba(255,255,255,0.06);border-radius:10px;overflow:hidden;">
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:12px 16px;font-size:12px;color:#9AA3B2;width:100px;">Email</td>
                <td style="padding:12px 16px;font-size:14px;color:#8B7DFF;">${email}</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:12px 16px;font-size:12px;color:#9AA3B2;">IP Address</td>
                <td style="padding:12px 16px;font-size:14px;font-weight:600;color:#F7F8FC;">${ip}</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:12px 16px;font-size:12px;color:#9AA3B2;">Attempts</td>
                <td style="padding:12px 16px;font-size:14px;font-weight:700;color:#ef4444;">${attempts}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:12px;color:#9AA3B2;">Time</td>
                <td style="padding:12px 16px;font-size:13px;color:#9AA3B2;">${timestamp}</td>
              </tr>
            </table>

            <p style="margin:20px 0 0;font-size:13px;color:#9AA3B2;line-height:1.6;">
              The IP has been rate limited. No action needed unless this continues.
              Check <a href="${process.env.NEXT_PUBLIC_APP_URL}/founder" style="color:#8B7DFF;text-decoration:none;">Founder Dashboard</a> for platform status.
            </p>

          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Security Alert — Gunimi

Multiple failed login attempts detected.

Email:    ${email}
IP:       ${ip}
Attempts: ${attempts}
Time:     ${timestamp}

The IP has been rate limited automatically.`;

  await sendEmail({
    from: "Gunimi Security <noreply@gunimi.com>",
    to: FOUNDER_EMAIL,
    subject: `⚠️ Security alert: ${attempts} failed logins from ${ip}`,
    html,
    text,
  });
}
