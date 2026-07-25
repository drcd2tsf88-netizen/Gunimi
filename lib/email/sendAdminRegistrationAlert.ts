import { sendEmail } from "./provider";

type Props = {
  name: string;
  email: string;
};

const ADMIN_EMAIL = "admin@gunimi.com";

export async function sendAdminRegistrationAlert({ name, email }: Props): Promise<void> {
  const now = new Date().toLocaleString("cs-CZ", {
    timeZone: "Europe/Prague",
    dateStyle: "full",
    timeStyle: "short",
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><title>New registration</title></head>
<body style="margin:0;padding:0;background:#05060A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#05060A;">
    <tr><td style="padding:32px 20px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="520" align="center" style="margin:0 auto;">

        <tr><td style="padding-bottom:20px;">
          <span style="font-size:16px;font-weight:700;color:#F7F8FC;letter-spacing:-0.02em;">Gunimi</span>
          <span style="font-size:12px;color:#9AA3B2;margin-left:8px;">Admin Alert</span>
        </td></tr>

        <tr><td style="background:#0A0E17;border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;">
          <div style="height:2px;background:linear-gradient(90deg,transparent,rgba(34,197,94,0.6),transparent);"></div>
          <div style="padding:28px 32px;">

            <div style="display:inline-block;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:20px;padding:3px 10px;margin-bottom:18px;">
              <span style="font-size:10px;font-weight:600;color:#22c55e;letter-spacing:0.12em;text-transform:uppercase;">New registration</span>
            </div>

            <h1 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#F7F8FC;letter-spacing:-0.02em;">
              Someone just signed up.
            </h1>

            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid rgba(255,255,255,0.06);border-radius:10px;overflow:hidden;">
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:12px 16px;font-size:12px;color:#9AA3B2;width:80px;">Name</td>
                <td style="padding:12px 16px;font-size:14px;font-weight:600;color:#F7F8FC;">${name || "—"}</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:12px 16px;font-size:12px;color:#9AA3B2;">Email</td>
                <td style="padding:12px 16px;font-size:14px;color:#8B7DFF;">${email}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:12px;color:#9AA3B2;">Time</td>
                <td style="padding:12px 16px;font-size:13px;color:#9AA3B2;">${now}</td>
              </tr>
            </table>

            <p style="margin:20px 0 0;font-size:13px;color:#9AA3B2;line-height:1.6;">
              Go to <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/admin/alpha" style="color:#8B7DFF;text-decoration:none;">Admin → Alpha</a> to review and approve.
            </p>

          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `New Gunimi registration

Name:  ${name || "—"}
Email: ${email}
Time:  ${now}

Approve at: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/admin/alpha`;

  await sendEmail({
    from: "Gunimi Alerts <noreply@gunimi.com>",
    to: ADMIN_EMAIL,
    subject: `New signup: ${name || email}`,
    html,
    text,
  });
}
