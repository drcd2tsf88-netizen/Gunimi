"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import {
  autoDetectMapping,
  ENTITY_FIELDS,
  EntityType,
  validateRow,
} from "@/lib/csv/schemas";
import { parseCSV } from "@/lib/csv/parser";
import { detectEntityType } from "@/lib/csv/detector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Radix Select does not allow empty-string values — use a sentinel.
const IGNORE = "__none__";

const ENTITY_ORDER: EntityType[] = ["companies", "contacts", "deals", "tasks"];

const ENTITY_COLORS: Record<EntityType, string> = {
  contacts: "bg-violet-500/15 text-violet-300 border-violet-500/20",
  companies: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  deals: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  tasks: "bg-amber-500/15 text-amber-300 border-amber-500/20",
};

type FileEntry = {
  id: string;
  filename: string;
  headers: string[];
  rows: Record<string, string>[];
  entityType: EntityType;
  mapping: Record<string, string>;
  autoDetected: Set<string>;
  parseError: string | null;
};

type BatchResult = {
  entityType: EntityType;
  imported: number;
  skipped: number;
};

type Step = "upload" | "map" | "preview" | "importing" | "result";

function cleanMapping(mapping: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(mapping).filter(([, v]) => v && v !== IGNORE)
  );
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") resolve(result);
      else reject(new Error("read error"));
    };
    reader.onerror = () => reject(new Error("read error"));
    reader.readAsText(file, "utf-8");
  });
}

export default function ImportWizard() {
  const t = useTranslations("import");
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("upload");
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<BatchResult[]>([]);
  const [importError, setImportError] = useState<string | null>(null);

  // ── file processing ──────────────────────────────────────────

  async function handleFiles(fileList: FileList | File[]) {
    const arr = Array.from(fileList);
    const newEntries: FileEntry[] = [];

    for (const file of arr) {
      const id = `${file.name}-${Date.now()}-${Math.random()}`;

      if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
        newEntries.push({
          id, filename: file.name,
          headers: [], rows: [],
          entityType: "contacts",
          mapping: {}, autoDetected: new Set(),
          parseError: t("invalidFileType"),
        });
        continue;
      }

      try {
        const raw = await readFileAsText(file);
        const { headers, rows } = parseCSV(raw);

        if (!headers.length || !rows.length) {
          newEntries.push({
            id, filename: file.name,
            headers: [], rows: [],
            entityType: "contacts",
            mapping: {}, autoDetected: new Set(),
            parseError: t("emptyFile"),
          });
          continue;
        }

        const { entityType } = detectEntityType(headers);
        const fields = ENTITY_FIELDS[entityType];
        const detected = autoDetectMapping(headers, fields);

        newEntries.push({
          id, filename: file.name,
          headers, rows, entityType,
          mapping: detected,
          autoDetected: new Set(Object.keys(detected)),
          parseError: null,
        });
      } catch {
        newEntries.push({
          id, filename: file.name,
          headers: [], rows: [],
          entityType: "contacts",
          mapping: {}, autoDetected: new Set(),
          parseError: t("invalidFileType"),
        });
      }
    }

    setFiles((prev) => [...prev, ...newEntries]);
    // Auto-expand first valid new file in map step
    const firstValid = newEntries.find((e) => !e.parseError);
    if (firstValid) {
      setExpandedIds((prev) => new Set([...prev, firstValid.id]));
    }
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setExpandedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }

  function changeEntityType(fileId: string, newType: EntityType) {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== fileId) return f;
        const fields = ENTITY_FIELDS[newType];
        const detected = autoDetectMapping(f.headers, fields);
        return {
          ...f,
          entityType: newType,
          mapping: detected,
          autoDetected: new Set(Object.keys(detected)),
        };
      })
    );
  }

  function updateMapping(fileId: string, header: string, value: string) {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== fileId) return f;
        return {
          ...f,
          mapping: { ...f.mapping, [header]: value === IGNORE ? "" : value },
        };
      })
    );
  }

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  // ── import ──────────────────────────────────────────────────

  async function runImport() {
    setStep("importing");
    setImportError(null);

    const validFiles = files.filter((f) => !f.parseError && f.rows.length > 0);
    const sorted = [...validFiles].sort(
      (a, b) => ENTITY_ORDER.indexOf(a.entityType) - ENTITY_ORDER.indexOf(b.entityType)
    );

    const batches = sorted.map((f) => ({
      entityType: f.entityType,
      rows: f.rows,
      mapping: cleanMapping(f.mapping),
    }));

    try {
      const res = await fetch("/api/import/universal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batches }),
      });

      if (!res.ok) {
        setImportError(t("importFailed"));
        setStep("preview");
        return;
      }

      const json = await res.json();
      setResults(json.results ?? []);
    } catch {
      setImportError(t("importFailed"));
      setStep("preview");
      return;
    }

    setStep("result");
  }

  // ── computed ─────────────────────────────────────────────────

  const validFiles = files.filter((f) => !f.parseError && f.rows.length > 0);

  const previewCounts = ENTITY_ORDER.reduce(
    (acc, type) => {
      const typeFiles = validFiles.filter((f) => f.entityType === type);
      const count = typeFiles.reduce((sum, f) => {
        const m = cleanMapping(f.mapping);
        const fields = ENTITY_FIELDS[f.entityType];
        return (
          sum +
          f.rows.filter((row) => validateRow(row, m, fields).errors.length === 0).length
        );
      }, 0);
      if (count > 0) acc[type] = count;
      return acc;
    },
    {} as Partial<Record<EntityType, number>>
  );

  const hasContactsOrDeals = !!(previewCounts.contacts || previewCounts.deals);

  // ── reset ────────────────────────────────────────────────────

  function reset() {
    setStep("upload");
    setFiles([]);
    setExpandedIds(new Set());
    setResults([]);
    setImportError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  // ── render ───────────────────────────────────────────────────

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-white/40">
        {t("importTitle")}
      </p>

      {/* ══ UPLOAD ══════════════════════════════════════════════ */}
      {step === "upload" && (
        <div className="mt-6">
          <div
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] transition-all hover:border-violet-500/30 hover:bg-violet-500/5"
          >
            <p className="text-sm text-white/50">{t("dropMultiple")}</p>
            <p className="mt-1 text-xs text-white/30">{t("dropMultipleHint")}</p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              multiple
              className="hidden"
              onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
            />
          </div>

          {files.length === 0 ? (
            <div className="mt-6 flex flex-col items-center py-6">
              <p className="text-sm text-white/30">{t("noFilesYet")}</p>
              <p className="mt-1 text-xs text-white/20">{t("noFilesHint")}</p>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {files.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-white">
                        {entry.filename}
                      </span>
                      {entry.parseError ? (
                        <span className="shrink-0 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] text-red-400">
                          {entry.parseError}
                        </span>
                      ) : (
                        <span className="shrink-0 text-xs text-white/30">
                          {entry.rows.length} {t("fileRows")}
                        </span>
                      )}
                    </div>
                    {!entry.parseError && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-xs text-white/30">{t("detectedAs")}</span>
                        <Select
                          value={entry.entityType}
                          onValueChange={(v) =>
                            changeEntityType(entry.id, v as EntityType)
                          }
                        >
                          <SelectTrigger
                            className={`h-6 w-auto gap-1 rounded-full border px-2.5 text-[11px] font-medium ${ENTITY_COLORS[entry.entityType]}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ENTITY_ORDER.map((type) => (
                              <SelectItem key={type} value={type}>
                                {t(type as Parameters<typeof t>[0])}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFile(entry.id)}
                    className="shrink-0 rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/60"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center rounded-xl border border-dashed border-white/[0.06] py-2.5 text-xs text-white/30 transition-all hover:border-white/10 hover:text-white/50"
              >
                {t("addMoreFiles")}
              </button>
            </div>
          )}

          {validFiles.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => {
                  setExpandedIds(new Set(validFiles.map((f) => f.id)));
                  setStep("map");
                }}
                className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500"
              >
                {t("next")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ══ MAP ═════════════════════════════════════════════════ */}
      {step === "map" && (
        <div className="mt-6">
          <p className="text-sm font-medium text-white">{t("mapColumns")}</p>
          <p className="mt-1 text-sm text-white/40">{t("mapSubtitle")}</p>

          <div className="mt-5 space-y-3">
            {validFiles.map((entry) => (
              <div
                key={entry.id}
                className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <button
                  onClick={() => toggleExpanded(entry.id)}
                  className="flex w-full items-center justify-between px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${ENTITY_COLORS[entry.entityType]}`}
                    >
                      {t(entry.entityType as Parameters<typeof t>[0])}
                    </span>
                    <span className="text-sm text-white/70">{entry.filename}</span>
                    <span className="text-xs text-white/30">
                      {entry.rows.length} {t("fileRows")}
                    </span>
                  </div>
                  {expandedIds.has(entry.id) ? (
                    <ChevronUp className="h-4 w-4 text-white/30" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-white/30" />
                  )}
                </button>

                {expandedIds.has(entry.id) && (
                  <div className="border-t border-white/[0.04] px-4 pb-4 pt-3">
                    <div className="grid grid-cols-2 gap-4 pb-2">
                      <p className="text-xs font-medium uppercase tracking-widest text-white/30">
                        {t("csvColumn")}
                      </p>
                      <p className="text-xs font-medium uppercase tracking-widest text-white/30">
                        {t("orbitField")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {entry.headers.map((header) => {
                        const fields = ENTITY_FIELDS[entry.entityType];
                        return (
                          <div
                            key={header}
                            className="grid grid-cols-2 items-center gap-4"
                          >
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm text-white/70">
                                {header}
                              </span>
                              {entry.autoDetected.has(header) &&
                                entry.mapping[header] && (
                                  <span className="shrink-0 rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] text-violet-300">
                                    {t("autoDetected")}
                                  </span>
                                )}
                            </div>
                            <Select
                              value={entry.mapping[header] || IGNORE}
                              onValueChange={(v) =>
                                updateMapping(entry.id, header, v)
                              }
                            >
                              <SelectTrigger className="h-9 w-full px-3 text-sm">
                                <SelectValue placeholder={t("ignore")} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={IGNORE}>
                                  {t("ignore")}
                                </SelectItem>
                                {fields.map((f) => (
                                  <SelectItem key={f.key} value={f.key}>
                                    {f.label}
                                    {f.required ? " *" : ""}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
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
              className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500"
            >
              {t("next")}
            </button>
          </div>
        </div>
      )}

      {/* ══ PREVIEW ═════════════════════════════════════════════ */}
      {step === "preview" && (
        <div className="mt-6">
          <p className="text-sm font-medium text-white">{t("universalPreviewTitle")}</p>
          <p className="mt-1 text-sm text-white/40">{t("universalPreviewSubtitle")}</p>

          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <p className="text-xs font-medium uppercase tracking-widest text-white/30">
              {t("willCreate")}
            </p>
            <div className="mt-3 flex flex-wrap gap-6">
              {ENTITY_ORDER.filter((type) => previewCounts[type]).map((type) => (
                <div key={type} className="flex items-center gap-2.5">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${ENTITY_COLORS[type]}`}
                  >
                    {t(type as Parameters<typeof t>[0])}
                  </span>
                  <span className="text-2xl font-semibold tabular-nums text-white">
                    {previewCounts[type]}
                  </span>
                </div>
              ))}
            </div>
            {hasContactsOrDeals && (
              <p className="mt-4 text-xs text-white/30">{t("autoCreateNote")}</p>
            )}
          </div>

          {importError && (
            <p className="mt-3 text-xs text-red-400">{importError}</p>
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
              className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500"
            >
              {t("importAll")}
            </button>
          </div>
        </div>
      )}

      {/* ══ IMPORTING ═══════════════════════════════════════════ */}
      {step === "importing" && (
        <div className="mt-6 flex flex-col items-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <p className="mt-4 text-sm text-white/50">{t("importing")}</p>
        </div>
      )}

      {/* ══ RESULT ══════════════════════════════════════════════ */}
      {step === "result" && (
        <div className="mt-6">
          <p className="text-sm font-medium text-emerald-400">{t("importComplete")}</p>
          <div className="mt-4 space-y-3">
            {results.map((r) => (
              <div key={r.entityType} className="flex items-center gap-3">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${ENTITY_COLORS[r.entityType] ?? "bg-white/10 text-white/60 border-white/10"}`}
                >
                  {t(r.entityType as Parameters<typeof t>[0])}
                </span>
                <span className="text-xl font-semibold tabular-nums text-white">
                  {r.imported}
                </span>
                <span className="text-xs text-white/40">{t("imported")}</span>
                {r.skipped > 0 && (
                  <>
                    <span className="ml-2 text-sm tabular-nums text-white/30">
                      {r.skipped}
                    </span>
                    <span className="text-xs text-white/30">
                      {t("duplicatesSkipped")}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button
              onClick={reset}
              className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500"
            >
              {t("importMore")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
