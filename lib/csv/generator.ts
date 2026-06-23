function escapeField(value: unknown): string {
  const str = value == null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateCSV(
  headers: string[],
  rows: Record<string, unknown>[]
): string {
  const bom = "﻿";
  const headerRow = headers.map(escapeField).join(",");
  const dataRows = rows.map((row) =>
    headers.map((h) => escapeField(row[h])).join(",")
  );
  return bom + [headerRow, ...dataRows].join("\n");
}
