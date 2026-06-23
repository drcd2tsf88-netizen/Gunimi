export type ParsedCSV = {
  headers: string[];
  rows: Record<string, string>[];
};

export function parseCSV(raw: string): ParsedCSV {
  const content = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  const text = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const records: string[][] = [];
  let fields: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i <= text.length; i++) {
    const ch = i < text.length ? text[i] : "\n";

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(field.trim());
        field = "";
      } else if (ch === "\n") {
        fields.push(field.trim());
        field = "";
        if (fields.some((f) => f !== "")) {
          records.push(fields);
        }
        fields = [];
      } else {
        field += ch;
      }
    }
  }

  if (records.length === 0) return { headers: [], rows: [] };

  const headers = records[0];
  const rows: Record<string, string>[] = records.slice(1).map((r) => {
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = r[idx] ?? "";
    });
    return row;
  });

  return { headers, rows };
}
