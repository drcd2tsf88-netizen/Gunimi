export type ImportField = {
  key: string;
  label: string;
  required: boolean;
  aliases: string[];
  validate?: (value: string) => string | null;
  transform?: (value: string) => unknown;
};

export type EntityType = "companies" | "contacts" | "deals";

export type ValidatedRow = {
  data: Record<string, unknown>;
  errors: { field: string; error: string }[];
};

function validateEnum(allowed: string[]) {
  return (value: string): string | null => {
    if (!value) return null;
    if (allowed.includes(value.toLowerCase())) return null;
    return `Must be one of: ${allowed.join(", ")}`;
  };
}

function parseNumber(value: string): number | null {
  if (!value) return null;
  const n = parseFloat(value.replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? null : n;
}

function parseDate(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[\s\-/\\]+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export const COMPANY_FIELDS: ImportField[] = [
  {
    key: "name",
    label: "Company Name",
    required: true,
    aliases: ["company", "organization", "org", "account", "company_name"],
  },
  {
    key: "industry",
    label: "Industry",
    required: false,
    aliases: ["sector", "vertical", "market", "type"],
  },
  {
    key: "website",
    label: "Website",
    required: false,
    aliases: ["url", "web", "domain", "site", "website_url", "domain_name"],
  },
  {
    key: "country",
    label: "Country",
    required: false,
    aliases: ["region", "location", "country_code", "country/region"],
  },
  {
    key: "phone",
    label: "Phone",
    required: false,
    aliases: ["tel", "telephone", "phone_number", "phone number"],
  },
  {
    key: "company_size",
    label: "Company Size",
    required: false,
    aliases: [
      "size",
      "employees",
      "headcount",
      "team_size",
      "number_of_employees",
    ],
  },
  {
    key: "status",
    label: "Status",
    required: false,
    aliases: ["account_type", "lifecycle_stage", "account type"],
    validate: validateEnum([
      "lead",
      "active",
      "customer",
      "partner",
      "inactive",
    ]),
  },
  {
    key: "relationship_stage",
    label: "Relationship Stage",
    required: false,
    aliases: ["stage", "relationship", "crm_stage", "pipeline stage"],
  },
];

export const CONTACT_FIELDS: ImportField[] = [
  {
    key: "name",
    label: "Full Name",
    required: true,
    aliases: [
      "contact",
      "person",
      "full_name",
      "contact_name",
      "contact name",
    ],
  },
  {
    key: "email",
    label: "Email",
    required: false,
    aliases: ["email_address", "e-mail", "mail", "email address"],
  },
  {
    key: "phone",
    label: "Phone",
    required: false,
    aliases: ["tel", "telephone", "phone_number", "mobile", "phone number"],
  },
  {
    key: "position",
    label: "Position",
    required: false,
    aliases: ["title", "job_title", "role", "job", "designation", "job title"],
  },
  {
    key: "company_name",
    label: "Company",
    required: false,
    aliases: ["company", "organization", "employer", "account", "company name"],
  },
  {
    key: "status",
    label: "Status",
    required: false,
    aliases: ["type", "contact_type", "lifecycle", "contact type"],
    validate: validateEnum(["lead", "qualified", "customer", "inactive"]),
  },
  {
    key: "notes",
    label: "Notes",
    required: false,
    aliases: ["note", "comments", "description", "bio", "remarks"],
  },
];

export const DEAL_FIELDS: ImportField[] = [
  {
    key: "title",
    label: "Deal Name",
    required: true,
    aliases: [
      "deal",
      "opportunity",
      "name",
      "deal_name",
      "opportunity name",
      "deal name",
    ],
  },
  {
    key: "value",
    label: "Value",
    required: false,
    aliases: [
      "amount",
      "revenue",
      "deal_value",
      "arr",
      "mrr",
      "price",
      "contract value",
    ],
    transform: parseNumber,
  },
  {
    key: "stage",
    label: "Stage",
    required: false,
    aliases: ["pipeline_stage", "deal_stage", "deal stage", "pipeline stage"],
    validate: validateEnum([
      "lead",
      "qualified",
      "proposal",
      "negotiation",
      "won",
      "lost",
    ]),
  },
  {
    key: "probability",
    label: "Probability %",
    required: false,
    aliases: [
      "close_probability",
      "win_probability",
      "chance",
      "win rate",
      "probability",
    ],
    transform: parseNumber,
  },
  {
    key: "description",
    label: "Description",
    required: false,
    aliases: ["notes", "comments", "details", "summary", "about"],
  },
  {
    key: "expected_close_date",
    label: "Expected Close Date",
    required: false,
    aliases: [
      "close_date",
      "closing_date",
      "target_date",
      "due_date",
      "close date",
      "closing date",
    ],
    transform: parseDate,
  },
  {
    key: "company_name",
    label: "Company",
    required: false,
    aliases: [
      "company",
      "organization",
      "account",
      "client",
      "account name",
    ],
  },
];

export const ENTITY_FIELDS: Record<EntityType, ImportField[]> = {
  companies: COMPANY_FIELDS,
  contacts: CONTACT_FIELDS,
  deals: DEAL_FIELDS,
};

export function autoDetectMapping(
  headers: string[],
  fields: ImportField[]
): Record<string, string> {
  const mapping: Record<string, string> = {};

  for (const header of headers) {
    const n = norm(header);
    let bestField: ImportField | null = null;
    let bestScore = 0;

    for (const field of fields) {
      let score = 0;

      if (n === norm(field.key)) {
        score = 100;
      } else {
        const terms = [field.key, ...field.aliases];
        for (const alias of terms) {
          const a = norm(alias);
          if (n === a) {
            score = Math.max(score, 90);
          } else if (
            (n.includes(a) || a.includes(n)) &&
            Math.min(n.length, a.length) >= 4
          ) {
            score = Math.max(score, 70);
          }
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestField = field;
      }
    }

    if (bestField && bestScore >= 70) {
      mapping[header] = bestField.key;
    }
  }

  return mapping;
}

export function validateRow(
  row: Record<string, string>,
  mapping: Record<string, string>,
  fields: ImportField[]
): ValidatedRow {
  const data: Record<string, unknown> = {};
  const errors: { field: string; error: string }[] = [];
  const fieldMap = new Map(fields.map((f) => [f.key, f]));

  for (const [csvHeader, fieldKey] of Object.entries(mapping)) {
    if (!fieldKey) continue;
    const field = fieldMap.get(fieldKey);
    if (!field) continue;
    const raw = row[csvHeader] ?? "";

    if (field.required && !raw.trim()) {
      errors.push({ field: field.label, error: "Required field is empty" });
      continue;
    }

    if (field.validate && raw.trim()) {
      const err = field.validate(raw.trim());
      if (err) {
        errors.push({ field: field.label, error: err });
        continue;
      }
    }

    if (field.transform && raw.trim()) {
      data[fieldKey] = field.transform(raw.trim());
    } else {
      data[fieldKey] = raw.trim() || null;
    }
  }

  for (const field of fields) {
    if (field.required && !(field.key in data)) {
      const isMapped = Object.values(mapping).includes(field.key);
      if (!isMapped) {
        errors.push({
          field: field.label,
          error: "Required field not mapped",
        });
      }
    }
  }

  return { data, errors };
}
