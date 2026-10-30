import { sendEmail } from "./provider";

type Props = {
  email: string;
  workspaceName: string;
  tokensUsed: number;
  dailyLimit: number;
  percentUsed: number;
  dashboardUrl: string;
};

export async function sendAIBudgetAlert({
  email,
  workspaceName,
  tokensUsed,
  dailyLimit,
  percentUsed,
  dashboardUrl,
}: Props): Promise<void> {
  const usedFormatted = tokensUsed.toLocaleString("en-US");
  const limitFormatted = dailyLimit.toLocaleString("en-US");
  const percentRounded = Math.round(percentUsed);

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><title>AI Budget Alert</title></head>
<body style="margin:0;padding:0;background:#05060A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#05060A;">
    <tr><td style="padding:32px 20px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="520" align="center" style="margin:0 auto;">

        <tr><td style="padding-bottom:20px;">
          <span style="font-size:16px;font-weight:700;color:#F7F8FC;letter-spacing:-0.02em;">Gunimi</span>
          <span style="font-size:12px;color:#9AA3B2;margin-left:8px;">AI Budget Alert</span>
        </td></tr>

        <tr><td style="background:#0A0E17;border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;">
          <div style="height:2px;background:linear-gradient(90deg,transparent,rgba(245,158,11,0.6),transparent);"></div>
          <div style="padding:28px 32px;">

            <div style="display:inline-block;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);border-radius:20px;padding:3px 10px;margin-bottom:18px;">
              <span style="font-size:10px;font-weight:600;color:#f59e0b;letter-spacing:0.12em;text-transform:uppercase;">Daily AI limit reached</span>
            </div>

            <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#F7F8FC;letter-spacing:-0.02em;">
              ${workspaceName} has used its daily AI budget.
            </h1>
            <p style="margin:0 0 24px;font-size:14px;color:#9AA3B2;line-height:1.6;">
              AI features are paused until midnight UTC. You can increase the limit in the Admin Console.
            </p>

            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid rgba(255,255,255,0.06);border-radius:10px;overflow:hidden;">
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:12px 16px;font-size:12px;color:#9AA3B2;width:130px;">Workspace</td>
                <td style="padding:12px 16px;font-size:14px;color:#8B7DFF;">${workspaceName}</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                <td style="padding:12px 16px;font-size:12px;color:#9AA3B2;">Tokens used</td>
                <td style="padding:12px 16px;font-size:14px;font-weight:700;color:#f59e0b;">${usedFormatted} / ${limitFormatted}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:12px;color:#9AA3B2;">Usage</td>
                <td style="padding:12px 16px;font-size:14px;font-weight:700;color:#ef4444;">${percentRounded}%</td>
              </tr>
            </table>

            <div style="margin-top:24px;">
              <a href="${dashboardUrl}/dashboard/admin/ai-ops" style="display:inline-block;background:#8B7DFF;color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:10px 20px;border-radius:8px;">
                Manage AI Budget →
              </a>
            </div>

            <p style="margin:20px 0 0;font-size:12px;color:#9AA3B2;line-height:1.6;">
              This notification is sent once per day per workspace. AI will resume automatically at midnight UTC.
            </p>

          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Gunimi — AI Budget Alert

${workspaceName} has reached its daily AI token limit.

Tokens used: ${usedFormatted} / ${limitFormatted} (${percentRounded}%)

AI features are paused until midnight UTC. Increase the limit at:
${dashboardUrl}/dashboard/admin/ai-ops

This notification is sent once per day per workspace.`;

  await sendEmail({
    from: "Gunimi Alerts <noreply@gunimi.com>",
    to: email,
    subject: `⚠️ AI budget limit reached — ${workspaceName}`,
    html,
    text,
  });
}
