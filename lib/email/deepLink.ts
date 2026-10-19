export function getEmailReplyUrl(
  provider: "gmail" | "microsoft365",
  providerThreadId: string,
  accountEmail: string
): string {
  if (provider === "gmail") {
    return `https://mail.google.com/mail/u/${encodeURIComponent(accountEmail)}/#inbox/${providerThreadId}`;
  }
  if (provider === "microsoft365") {
    return `https://outlook.office.com/mail/inbox/id/${encodeURIComponent(providerThreadId)}`;
  }
  return "#";
}
