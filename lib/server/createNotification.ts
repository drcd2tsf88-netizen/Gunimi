import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";
import { sendTaskAssigned } from "@/lib/email/sendTaskAssigned";
import { sendEmail } from "@/lib/email/provider";
import { APP_CONFIG } from "@/lib/config/app";
import {
  resolveEmailLocale,
  getTaskDoneStrings,
  getTaskCommentStrings,
  getTaskDueDateChangedStrings,
} from "@/lib/email/emailI18n";

type CreateNotificationParams = {
  workspaceId: string;
  userId: string;
  type: string;
  title: string;
  body?: string;
  href?: string;
  workspaceName?: string;
  /** For task_comment: name of the commenter */
  senderName?: string;
  /** For task_due_changed: formatted new due date string */
  newDueDate?: string;
};

async function getWorkspaceLocale(workspaceId: string): Promise<string> {
  const { data } = await supabaseAdmin
    .from("workspaces")
    .select("preferences")
    .eq("id", workspaceId)
    .maybeSingle();
  const lang = (data?.preferences as { language?: string } | null)?.language;
  return resolveEmailLocale(lang);
}

async function getUserEmail(userId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (error || !data?.user?.email) return null;
  return data.user.email;
}

function buildSimpleEmail(opts: {
  lang: string;
  subject: string;
  badge: string;
  badgeColor: string;
  accentColor: string;
  heading: string;
  body: string;
  cta: string;
  taskUrl: string;
  footerNote: string;
}): string {
  const { lang, subject, badge, badgeColor, accentColor, heading, body, cta, taskUrl, footerNote } = opts;
  return `<!DOCTYPE html>
<html lang="${lang}" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark light" />
  <title>${subject}</title>
  <style>
    body { margin:0;padding:0;background-color:#05060A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif; }
    @media (prefers-color-scheme: light) {
      body { background-color:#f5f5f5 !important; }
      .card { background-color:#ffffff !important;border-color:#e5e7eb !important; }
      .heading { color:#111827 !important; }
      .body-text { color:#374151 !important; }
      .meta-text { color:#6b7280 !important; }
    }
    @media only screen and (max-width:600px) {
      .email-container { width:100% !important; }
      .content-pad { padding:32px 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#05060A;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#05060A;">
    <tr><td style="padding:40px 20px;">
      <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="560" align="center" style="margin:0 auto;">
        <tr>
          <td style="padding-bottom:28px;text-align:center;">
            <div style="display:inline-block;width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6D5BFF,#22D3EE);vertical-align:middle;margin-right:10px;"></div>
            <span style="font-size:18px;font-weight:700;color:#F7F8FC;vertical-align:middle;letter-spacing:-0.02em;">Gunimi</span>
          </td>
        </tr>
        <tr>
          <td class="card" style="background-color:#0A0E17;border:1px solid rgba(255,255,255,0.06);border-radius:20px;overflow:hidden;">
            <div style="height:1px;background:linear-gradient(90deg,transparent,${accentColor},transparent);"></div>
            <div class="content-pad" style="padding:40px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="background-color:${badgeColor};border-radius:20px;padding:4px 12px;">
                    <span style="font-size:11px;font-weight:600;color:#8B7DFF;letter-spacing:0.12em;text-transform:uppercase;">${badge}</span>
                  </td>
                </tr>
              </table>
              <h1 class="heading" style="margin:24px 0 12px;font-size:26px;font-weight:700;color:#F7F8FC;letter-spacing:-0.03em;line-height:1.2;">${heading}</h1>
              <p class="body-text" style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#9AA3B2;">${body}</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-radius:12px;background:linear-gradient(135deg,#6D5BFF,#5B4AE8);box-shadow:0 0 24px rgba(109,91,255,0.35);">
                    <a href="${taskUrl}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;letter-spacing:-0.01em;">${cta}</a>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:32px 0;">
                <tr><td style="border-top:1px solid rgba(255,255,255,0.05);font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
              <p class="meta-text" style="margin:0;font-size:12px;color:#9AA3B2;line-height:1.5;">${footerNote}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 0;text-align:center;">
            <p style="margin:0;font-size:12px;color:rgba(154,163,178,0.4);line-height:1.5;">
              Gunimi &mdash; AI Workspace OS<br />
              <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:rgba(109,91,255,0.5);text-decoration:none;">${process.env.NEXT_PUBLIC_APP_URL}</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function createNotification({
  workspaceId,
  userId,
  type,
  title,
  body,
  href,
  workspaceName,
  senderName,
  newDueDate,
}: CreateNotificationParams): Promise<void> {
  const { error } = await supabaseAdmin
    .from("workspace_notifications")
    .insert({
      workspace_id: workspaceId,
      user_id: userId,
      type,
      title,
      body: body ?? null,
      href: href ?? null,
    });

  if (error) {
    logger.error("createNotification failed:", error);
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const taskUrl = href ? `${appUrl}${href}` : `${appUrl}/dashboard/tasks`;

  // ── task_assigned ────────────────────────────────────────────────────────────
  if (type === "task_assigned") {
    const email = await getUserEmail(userId);
    if (!email) { logger.warn(`[notification] task_assigned — no email for user ${userId}`); return; }
    const locale = await getWorkspaceLocale(workspaceId);
    await sendTaskAssigned({ email, taskTitle: title, workspaceName: workspaceName ?? "your workspace", href, locale }).catch(
      (err) => logger.error("sendTaskAssigned email failed:", err)
    );
    return;
  }

  // ── task_done ────────────────────────────────────────────────────────────────
  if (type === "task_done") {
    const email = await getUserEmail(userId);
    if (!email) { logger.warn(`[notification] task_done — no email for user ${userId}`); return; }
    const locale = await getWorkspaceLocale(workspaceId);
    const l = resolveEmailLocale(locale);
    const wsName = workspaceName ?? "your workspace";
    const s = getTaskDoneStrings(l, title, wsName, email, taskUrl);
    const html = buildSimpleEmail({
      lang: l, subject: s.subject, badge: s.badge,
      badgeColor: "rgba(16,185,129,0.1)", accentColor: "rgba(16,185,129,0.4)",
      heading: s.heading, body: s.body, cta: s.cta, taskUrl, footerNote: s.footerNote,
    });
    await sendEmail({ from: APP_CONFIG.email.from, to: email, subject: s.subject, html, text: s.textBody }).catch(
      (err) => logger.error("sendTaskDone email failed:", err)
    );
    return;
  }

  // ── task_comment ─────────────────────────────────────────────────────────────
  if (type === "task_comment") {
    const email = await getUserEmail(userId);
    if (!email) { logger.warn(`[notification] task_comment — no email for user ${userId}`); return; }
    const locale = await getWorkspaceLocale(workspaceId);
    const l = resolveEmailLocale(locale);
    const wsName = workspaceName ?? "your workspace";
    const commenter = senderName ?? "Someone";
    const s = getTaskCommentStrings(l, title, wsName, email, taskUrl, commenter);
    const html = buildSimpleEmail({
      lang: l, subject: s.subject, badge: s.badge,
      badgeColor: "rgba(109,91,255,0.1)", accentColor: "rgba(109,91,255,0.4)",
      heading: s.heading, body: s.body, cta: s.cta, taskUrl, footerNote: s.footerNote,
    });
    await sendEmail({ from: APP_CONFIG.email.from, to: email, subject: s.subject, html, text: s.textBody }).catch(
      (err) => logger.error("sendTaskComment email failed:", err)
    );
    return;
  }

  // ── task_due_changed ─────────────────────────────────────────────────────────
  if (type === "task_due_changed") {
    const email = await getUserEmail(userId);
    if (!email) { logger.warn(`[notification] task_due_changed — no email for user ${userId}`); return; }
    const locale = await getWorkspaceLocale(workspaceId);
    const l = resolveEmailLocale(locale);
    const wsName = workspaceName ?? "your workspace";
    const rawDate = newDueDate ?? body;
    const dateLocaleMap: Record<string, string> = { en: "en-US", sk: "sk-SK", cs: "cs-CZ" };
    const dateLocale = dateLocaleMap[l] ?? "en-US";
    let dueDateStr = "—";
    if (rawDate) {
      try {
        dueDateStr = new Date(rawDate).toLocaleDateString(dateLocale, {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
        });
      } catch {
        dueDateStr = rawDate;
      }
    }
    const s = getTaskDueDateChangedStrings(l, title, wsName, email, taskUrl, dueDateStr);
    const html = buildSimpleEmail({
      lang: l, subject: s.subject, badge: s.badge,
      badgeColor: "rgba(245,158,11,0.1)", accentColor: "rgba(245,158,11,0.4)",
      heading: s.heading, body: s.body, cta: s.cta, taskUrl, footerNote: s.footerNote,
    });
    await sendEmail({ from: APP_CONFIG.email.from, to: email, subject: s.subject, html, text: s.textBody }).catch(
      (err) => logger.error("sendTaskDueDateChanged email failed:", err)
    );
    return;
  }
}
