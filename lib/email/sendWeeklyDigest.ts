import { getEmailClient } from "./client";
import { getWeeklyDigestStrings, resolveEmailLocale, type EmailLocale } from "./emailI18n";

export type WeeklySignal = {
  title: string;
  entityName: string;
};

export type WeeklyDeal = {
  id: string;
  title: string;
  stage: string;
  healthDot: "green" | "amber" | "red" | "neutral";
};

export type WeeklyRelationship = {
  id: string;
  name: string;
  score: number;
};

type Props = {
  email: string;
  name: string;
  workspaceName: string;
  language?: string;
  aiNarrative: string | null;
  signals: WeeklySignal[];
  deals: WeeklyDeal[];
  relationships: WeeklyRelationship[];
  dashboardUrl: string;
  weekLabel: string;
};

const DOT_COLORS: Record<WeeklyDeal["healthDot"], string> = {
  green: "#22C55E",
  amber: "#F59E0B",
  red: "#EF4444",
  neutral: "rgba(154,163,178,0.3)",
};

function renderRow(icon: string, label: string, sub: string): string {
  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td width="28" style="vertical-align:top;padding-top:2px;">
              <span style="font-size:13px;">${icon}</span>
            </td>
            <td style="vertical-align:top;">
              <p style="margin:0;font-size:13px;color:#E2E5EC;line-height:1.4;">${label}</p>
              ${sub ? `<p style="margin:2px 0 0;font-size:11px;color:rgba(154,163,178,0.7);">${sub}</p>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function renderDealRow(deal: WeeklyDeal): string {
  const dotColor = DOT_COLORS[deal.healthDot];
  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td width="28" style="vertical-align:middle;padding-top:2px;">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:${dotColor};"></span>
            </td>
            <td style="vertical-align:top;">
              <p style="margin:0;font-size:13px;color:#E2E5EC;line-height:1.4;">${deal.title}</p>
              <p style="margin:2px 0 0;font-size:11px;color:rgba(154,163,178,0.7);">${deal.stage}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function renderSection(heading: string, rows: string, empty: string): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px;">
      <tr>
        <td>
          <p style="margin:0 0 10px;font-size:11px;font-weight:600;color:#6D5BFF;letter-spacing:0.1em;text-transform:uppercase;">${heading}</p>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:4px 16px;background-color:rgba(255,255,255,0.02);">
            ${rows || `<tr><td style="padding:10px 0;"><p style="margin:0;font-size:13px;color:rgba(154,163,178,0.5);">${empty}</p></td></tr>`}
          </table>
        </td>
      </tr>
    </table>`;
}

export async function sendWeeklyDigest({
  email,
  name,
  workspaceName,
  language,
  aiNarrative,
  signals,
  deals,
  relationships,
  dashboardUrl,
  weekLabel,
}: Props): Promise<void> {
  const locale: EmailLocale = resolveEmailLocale(language);
  const firstName = name?.split(" ")[0]?.trim() || "there";
  const s = getWeeklyDigestStrings(locale, firstName, workspaceName, email, weekLabel);

  const signalRows = signals
    .slice(0, 6)
    .map((sig) => renderRow("◉", sig.title, sig.entityName))
    .join("");

  const dealRows = deals
    .slice(0, 6)
    .map((d) => renderDealRow(d))
    .join("");

  const relationshipRows = relationships
    .slice(0, 6)
    .map((r) => {
      const bar = Math.round(r.score / 10);
      const filled = "█".repeat(bar);
      const empty = "░".repeat(10 - bar);
      return renderRow("👤", r.name, `${filled}${empty} ${r.score}/100`);
    })
    .join("");

  const narrativeBlock = aiNarrative
    ? `<div style="margin-bottom:28px;padding:16px 20px;background:linear-gradient(135deg,rgba(109,91,255,0.08),rgba(34,211,238,0.04));border:1px solid rgba(109,91,255,0.2);border-radius:12px;">
        <p style="margin:0 0 4px;font-size:10px;font-weight:600;color:#6D5BFF;letter-spacing:0.12em;text-transform:uppercase;">AI Summary</p>
        <p style="margin:0;font-size:14px;color:#C4C9D6;line-height:1.65;">${aiNarrative}</p>
      </div>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="${locale}" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark light" />
  <title>${s.subject}</title>
  <style>
    body { margin:0;padding:0;background-color:#05060A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif; }
    @media only screen and (max-width:600px) {
      .email-container { width:100% !important; }
      .content-pad { padding:28px 20px !important; }
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
            <td style="padding-bottom:24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <div style="display:inline-block;width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#6D5BFF,#22D3EE);vertical-align:middle;margin-right:8px;"></div>
                    <span style="font-size:16px;font-weight:700;color:#F7F8FC;vertical-align:middle;letter-spacing:-0.02em;">Gunimi</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#0A0E17;border:1px solid rgba(255,255,255,0.06);border-radius:20px;overflow:hidden;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(109,91,255,0.4),transparent);"></div>
              <div class="content-pad" style="padding:36px 36px;">

                <!-- Greeting -->
                <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#F7F8FC;letter-spacing:-0.03em;">${s.greeting}</p>
                <p style="margin:0 0 28px;font-size:14px;line-height:1.65;color:#9AA3B2;">${s.intro}</p>

                <!-- AI Narrative -->
                ${narrativeBlock}

                <!-- Signals -->
                ${renderSection(s.sectionSignals, signalRows, s.noSignals)}

                <!-- Pipeline -->
                ${renderSection(s.sectionDeals, dealRows, s.noDeals)}

                <!-- Relationships -->
                ${renderSection(s.sectionRelationships, relationshipRows, s.noRelationships)}

                <!-- CTA -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="border-radius:12px;background:linear-gradient(135deg,#6D5BFF,#5B4AE8);box-shadow:0 0 20px rgba(109,91,255,0.30);">
                      <a href="${dashboardUrl}" target="_blank" style="display:inline-block;padding:13px 26px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;letter-spacing:-0.01em;">
                        ${s.cta}
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Divider -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:28px 0 20px;">
                  <tr><td style="border-top:1px solid rgba(255,255,255,0.05);font-size:0;line-height:0;">&nbsp;</td></tr>
                </table>

                <p style="margin:0;font-size:12px;color:rgba(154,163,178,0.4);line-height:1.6;">${s.footerNote}</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 0;text-align:center;">
              <p style="margin:0;font-size:11px;color:rgba(154,163,178,0.3);line-height:1.5;">
                Gunimi &mdash; Every client. Always remembered.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = buildTextBody(s, aiNarrative, signals, deals, relationships, dashboardUrl);

  const client = getEmailClient();
  await client.sendEmail({
    From: "Gunimi <hello@gunimi.com>",
    To: email,
    Subject: s.subject,
    HtmlBody: html,
    TextBody: text,
    ReplyTo: "hello@gunimi.com",
    MessageStream: "outbound",
  });
}

function buildTextBody(
  s: ReturnType<typeof getWeeklyDigestStrings>,
  aiNarrative: string | null,
  signals: WeeklySignal[],
  deals: WeeklyDeal[],
  relationships: WeeklyRelationship[],
  dashboardUrl: string,
): string {
  const lines: string[] = [s.greeting, "", s.intro, ""];

  if (aiNarrative) {
    lines.push(`── AI Summary ──`, aiNarrative, "");
  }

  lines.push(`── ${s.sectionSignals} ──`);
  if (signals.length === 0) {
    lines.push(s.noSignals);
  } else {
    signals.slice(0, 6).forEach((sig) => {
      lines.push(`• ${sig.title}${sig.entityName ? ` (${sig.entityName})` : ""}`);
    });
  }

  lines.push("", `── ${s.sectionDeals} ──`);
  if (deals.length === 0) {
    lines.push(s.noDeals);
  } else {
    deals.slice(0, 6).forEach((d) => {
      lines.push(`• ${d.title} — ${d.stage}`);
    });
  }

  lines.push("", `── ${s.sectionRelationships} ──`);
  if (relationships.length === 0) {
    lines.push(s.noRelationships);
  } else {
    relationships.slice(0, 6).forEach((r) => {
      lines.push(`• ${r.name} — ${r.score}/100`);
    });
  }

  lines.push("", dashboardUrl, "", "---", "Gunimi — Every client. Always remembered.");
  return lines.join("\n");
}
