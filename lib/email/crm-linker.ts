import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

const COMMON_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "yahoo.co.uk",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
]);

function extractDomain(email: string): string | null {
  const parts = email.toLowerCase().split("@");
  if (parts.length !== 2) return null;
  return parts[1];
}

export async function linkThreadToCrm(
  workspaceId: string,
  threadId: string,
  participantEmails: string[]
): Promise<{ contactId: string | null; companyId: string | null }> {
  if (participantEmails.length === 0) {
    return { contactId: null, companyId: null };
  }

  const lowerEmails = participantEmails.map((e) => e.toLowerCase());

  // Exact email match against workspace_contacts
  const { data: contacts } = await supabaseAdmin
    .from("workspace_contacts")
    .select("id, email")
    .eq("workspace_id", workspaceId)
    .in("email", lowerEmails)
    .limit(1);

  const contactId = contacts?.[0]?.id ?? null;

  // Domain match against workspace_companies (exclude common provider domains)
  const candidateDomains = lowerEmails
    .map(extractDomain)
    .filter((d): d is string => d !== null && !COMMON_EMAIL_DOMAINS.has(d));

  let companyId: string | null = null;

  if (candidateDomains.length > 0) {
    const { data: companies } = await supabaseAdmin
      .from("workspace_companies")
      .select("id, website")
      .eq("workspace_id", workspaceId);

    if (companies && companies.length > 0) {
      for (const company of companies) {
        if (!company.website) continue;
        let companyDomain: string;
        try {
          companyDomain = new URL(
            company.website.startsWith("http") ? company.website : `https://${company.website}`
          ).hostname.replace(/^www\./, "").toLowerCase();
        } catch {
          continue;
        }
        if (candidateDomains.includes(companyDomain)) {
          companyId = company.id;
          break;
        }
      }
    }
  }

  if (contactId || companyId) {
    await supabaseAdmin
      .from("email_threads")
      .update({
        contact_id: contactId,
        company_id: companyId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", threadId);
  }

  return { contactId, companyId };
}
