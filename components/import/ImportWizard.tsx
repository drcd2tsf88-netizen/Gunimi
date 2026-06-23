"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  autoDetectMapping,
  ENTITY_FIELDS,
  EntityType,
  ImportField,
  validateRow,
  ValidatedRow,
} from "@/lib/csv/schemas";
import { parseCSV } from "@/lib/csv/parser";
import { generateCSV } from "@/lib/csv/generator";

type Step = "entity" | "upload" | "map" | "preview" | "importing" | "result";

type ImportError = { row: number; field: string; error: string };
type ImportResult = { imported: number; skipped: number; errors: ImportError[] };

const ENTITY_OPTIONS: { key: EntityType; label: string }[] = [
  { key: "companies", label: "Companies" },
  { key: "contacts", label: "Contacts" },
  { key: "deals", label: "Deals" },
];

const IMPORT_ENDPOINTS: Record<EntityType, string> = {
  companies: "/api/import/companies",
  contacts: "/api/import/contacts",
  deals: "/api/import/deals",
};

export default function ImportWizard() {
  const t = useTranslations("import");
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("entity");
  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [autoDetected, setAutoDetected] = useState<Set<string>>(new Set());
  const [fileError, setFileError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const fields: ImportField[] = entityType ? ENTITY_FIELDS[entityType] : [];

  // ── helpers ──────────────────────────────────────────────────────────────

  function getValidatedRows(): ValidatedRow[] {
    return csvRows.map((row) => validateRow(row, mapping, fields));
  }

  const validCount = getValidatedRows().filter((r) => r.errors.length === 0).length;
  const invalidCount = csvRows.length - validCount;

  function handleFileRead(file: File) {
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setFileError(t("invalidFileType"));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const raw = e.target?.result;
      if (typeof raw !== "string") return;
      const { headers, rows } = parseCSV(raw);
      if (!headers.length || !rows.length) {
        setFileError(t("emptyFile"));
        return;
      }
      setCsvHeaders(headers);
      setCsvRows(rows);
      const detected = autoDetectMapping(headers, fields);
      setMapping(detected);
      setAutoDetected(new Set(Object.keys(detected)));
      setFileError(null);
      setStep("map");
    };
    reader.readAsText(file);
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileRead(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields]
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileRead(file);
  }

  async function runImport() {
    if (!entityType) return;
    setStep("importing");

    const validRows = csvRows.filter(
      (row) => validateRow(row, mapping, fields).errors.length === 0
    );

    try {
      const res = await fetch(IMPORT_ENDPOINTS[entityType], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: validRows, mapping }),
      });
      const json = await res.json();
      setResult({
        imported: json.imported ?? 0,
        skipped: (json.skipped ?? 0) + invalidCount,
        errors: json.errors ?? [],
      });
    } catch {
      setResult({ imported: 0, skipped: csvRows.length, errors: [] });
    }

    setStep("result");
  }

  function downloadErrorReport() {
    if (!result?.errors.length) return;
    const csv = generateCSV(
      ["row", "field", "error"],
      result.errors as unknown as Record<string, unknown>[]
    );
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "import-errors.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setStep("entity");
    setEntityType(null);
    setCsvHeaders([]);
    setCsvRows([]);
    setMapping({});
    setAutoDetected(new Set());
    setFileError(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  // ── mapped preview columns ────────────────────────────────────────────────

  const mappedColumns = csvHeaders.filter((h) => mapping[h]);
  const previewRows = csvRows.slice(0, 5);

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-white/40">
        {t("importTitle")}
      </p>

      {/* Step: entity selection */}
      {step === "entity" && (
        <div className="mt-6">
          <p className="text-sm font-medium text-white">{t("selectEntity")}</p>
          <p className="mt-1 text-sm text-white/40">{t("selectEntitySubtitle")}</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {ENTITY_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setEntityType(opt.key);
                  setStep("upload");
                }}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-5 text-left transition-all hover:border-violet-500/30 hover:bg-violet-500/5"
              >
                <p className="text-sm font-medium text-white">{t(opt.key as Parameters<typeof t>[0])}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: file upload */}
      {step === "upload" && (
        <div className="mt-6">
          <p className="text-sm font-medium text-white">{t("uploadFile")}</p>
          <p className="mt-1 text-sm text-white/40">{t("uploadSubtitle")}</p>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="mt-4 flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] transition-all hover:border-violet-500/30 hover:bg-violet-500/5"
          >
            <p className="text-sm text-white/50">{t("dropHere")}</p>
            <p className="mt-1 text-xs text-white/30">{t("browse")}</p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {fileError && (
            <p className="mt-3 text-xs text-red-400">{fileError}</p>
          )}
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setStep("entity")}
              className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm text-white/50 hover:text-white"
            >
              {t("back")}
            </button>
          </div>
        </div>
      )}

      {/* Step: column mapping */}
      {step === "map" && (
        <div className="mt-6">
          <p className="text-sm font-medium text-white">{t("mapColumns")}</p>
          <p className="mt-1 text-sm text-white/40">{t("mapSubtitle")}</p>
          <p className="mt-3 text-xs text-white/30">
            {csvRows.length} {t("detectedRows")} · {csvHeaders.length} {t("detectedHeaders")}
          </p>
          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-2 gap-4 pb-2">
              <p className="text-xs font-medium uppercase tracking-widest text-white/30">{t("csvColumn")}</p>
              <p className="text-xs font-medium uppercase tracking-widest text-white/30">{t("orbitField")}</p>
            </div>
            {csvHeaders.map((header) => (
              <div key={header} className="grid grid-cols-2 items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm text-white/70">{header}</span>
                  {autoDetected.has(header) && mapping[header] && (
                    <span className="shrink-0 rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] text-violet-300">
                      {t("autoDetected")}
                    </span>
                  )}
                </div>
                <select
                  value={mapping[header] ?? ""}
                  onChange={(e) =>
                    setMapping((prev) => ({ ...prev, [header]: e.target.value }))
                  }
                  className="rounded-xl border border-white/[0.06] bg-[#050816] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500/40"
                >
                  <option value="">{t("ignore")}</option>
                  {fields.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                      {f.required ? " *" : ""}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep("upload")}
              className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm text-white/50 hover:text-white"
            >
              {t("back")}
            </button>
            <button
              onClick={() => setStep("preview")}
              disabled={!Object.values(mapping).some(Boolean)}
              className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white transition-opacity hover:bg-violet-500 disabled:opacity-40"
            >
              {t("next")}
            </button>
          </div>
        </div>
      )}

      {/* Step: preview & validation */}
      {step === "preview" && (
        <div className="mt-6">
          <p className="text-sm font-medium text-white">{t("preview")}</p>
          <p className="mt-1 text-sm text-white/40">{t("previewSubtitle")}</p>
          <div className="mt-3 flex gap-4 text-sm">
            <span className="text-emerald-400">
              {validCount} {t("validRows")}
            </span>
            {invalidCount > 0 && (
              <span className="text-red-400">
                {invalidCount} {t("invalidRows")}
              </span>
            )}
          </div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-white/[0.06]">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  {mappedColumns.map((h) => {
                    const field = fields.find((f) => f.key === mapping[h]);
                    return (
                      <th
                        key={h}
                        className="px-4 py-2 text-left text-xs font-medium text-white/40"
                      >
                        {field?.label ?? h}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, i) => {
                  const { errors: rowErrors } = validateRow(row, mapping, fields);
                  return (
                    <tr
                      key={i}
                      className={`border-b border-white/[0.04] ${rowErrors.length > 0 ? "bg-red-500/5" : ""}`}
                    >
                      {mappedColumns.map((h) => (
                        <td key={h} className="px-4 py-2 text-xs text-white/70">
                          {row[h] || (
                            <span className="text-white/20">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {csvRows.length > 5 && (
            <p className="mt-2 text-xs text-white/30">
              +{csvRows.length - 5} more rows
            </p>
          )}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep("map")}
              className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm text-white/50 hover:text-white"
            >
              {t("back")}
            </button>
            <button
              onClick={runImport}
              disabled={validCount === 0}
              className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white transition-opacity hover:bg-violet-500 disabled:opacity-40"
            >
              {t("importButton")} {validCount > 0 ? `(${validCount})` : ""}
            </button>
          </div>
        </div>
      )}

      {/* Step: importing */}
      {step === "importing" && (
        <div className="mt-6 flex flex-col items-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <p className="mt-4 text-sm text-white/50">{t("importing")}</p>
        </div>
      )}

      {/* Step: result */}
      {step === "result" && result !== null && (
        <div className="mt-6">
          <p className="text-sm font-medium text-emerald-400">
            {t("importComplete")}
          </p>
          <div className="mt-4 flex gap-6 text-sm">
            <div>
              <p className="text-2xl font-semibold text-white">{result.imported}</p>
              <p className="mt-1 text-xs text-white/40">{t("imported")}</p>
            </div>
            {result.skipped > 0 && (
              <div>
                <p className="text-2xl font-semibold text-red-400">{result.skipped}</p>
                <p className="mt-1 text-xs text-white/40">{t("skipped")}</p>
              </div>
            )}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={reset}
              className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500"
            >
              {t("startOver")}
            </button>
            {result.errors.length > 0 && (
              <button
                onClick={downloadErrorReport}
                className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm text-white/50 hover:text-white"
              >
                {t("downloadErrorReport")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
