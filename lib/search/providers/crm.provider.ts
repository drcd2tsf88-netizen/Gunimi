import { searchCRMEntities } from "@/server/actions/search/searchCRMEntities";
import type { ContactRow, CompanyRow } from "@/server/actions/search/searchCRMEntities";

import { searchRegistry } from "@/lib/search/registry";
import type { EntityResult, SearchProvider, SearchQuery } from "@/lib/search/types";

// Scores a contact match — name matches rank higher than email-only matches.
function scoreContact(name: string, email: string | null, query: string): number {
  const q = query.toLowerCase();
  const n = name.toLowerCase();

  if (n === q) return 1.0;
  if (n.startsWith(q)) return 0.9;
  if (n.split(" ").some((word) => word.startsWith(q))) return 0.8;
  if (n.includes(q)) return 0.7;
  if (email?.toLowerCase().includes(q)) return 0.5;

  return 0.6;
}

// Scores a company match by name.
function scoreCompany(name: string, query: string): number {
  const q = query.toLowerCase();
  const n = name.toLowerCase();

  if (n === q) return 1.0;
  if (n.startsWith(q)) return 0.9;
  if (n.split(" ").some((word) => word.startsWith(q))) return 0.8;
  if (n.includes(q)) return 0.7;

  return 0.6;
}

function mapContact(contact: ContactRow, query: string): EntityResult {
  return {
    kind: "entity",
    id: `contact:${contact.id}`,
    entityType: "contact",
    entityId: contact.id,
    href: `/dashboard/crm/${contact.id}`,
    title: contact.name,
    description: contact.email ?? contact.position ?? undefined,
    category: "crm",
    score: scoreContact(contact.name, contact.email, query),
    priority: 20,
    metadata: { entityType: "contact" },
  };
}

function mapCompany(company: CompanyRow, query: string): EntityResult {
  return {
    kind: "entity",
    id: `company:${company.id}`,
    entityType: "company",
    entityId: company.id,
    href: `/dashboard/companies/${company.id}`,
    title: company.name,
    description: undefined,
    category: "crm",
    score: scoreCompany(company.name, query),
    priority: 20,
    metadata: { entityType: "company" },
  };
}

const crmSearchProvider: SearchProvider = {
  id: "crm-entities",
  name: "CRM",
  priority: 20,

  async search({ query, limit = 20 }: SearchQuery): Promise<EntityResult[]> {
    if (!query.trim()) return [];

    const { contacts, companies } = await searchCRMEntities(query);

    const results: EntityResult[] = [
      ...contacts.map((c) => mapContact(c, query)),
      ...companies.map((c) => mapCompany(c, query)),
    ];

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },
};

// Auto-registers when this module is imported
searchRegistry.register(crmSearchProvider);
