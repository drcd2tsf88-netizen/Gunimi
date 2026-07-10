#!/usr/bin/env node
// Locale parity gate — verifies EN/SK/CS have identical key sets.
// Exits 1 on any discrepancy so CI can block the merge.

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function flatten(obj, prefix = "") {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      keys.push(...flatten(v, key));
    } else {
      keys.push(key);
    }
  }
  return keys;
}

function loadKeys(lang) {
  const path = resolve(ROOT, "locales", `${lang}.json`);
  return flatten(JSON.parse(readFileSync(path, "utf-8")));
}

const en = loadKeys("en");
const sk = loadKeys("sk");
const cs = loadKeys("cs");

const enSet = new Set(en);
const skSet = new Set(sk);
const csSet = new Set(cs);

const missingInSk = en.filter((k) => !skSet.has(k));
const missingInCs = en.filter((k) => !csSet.has(k));
const orphanInSk  = sk.filter((k) => !enSet.has(k));
const orphanInCs  = cs.filter((k) => !enSet.has(k));

let failed = false;

function report(label, keys) {
  if (keys.length === 0) return;
  failed = true;
  console.error(`\n[locales] ${label} (${keys.length}):`);
  keys.forEach((k) => console.error(`  - ${k}`));
}

report("Missing in sk.json", missingInSk);
report("Missing in cs.json", missingInCs);
report("Orphan in sk.json (not in en)", orphanInSk);
report("Orphan in cs.json (not in en)", orphanInCs);

if (failed) {
  console.error("\n[locales] FAIL — locale files are out of sync.\n");
  process.exit(1);
} else {
  console.log(`[locales] PASS — EN:${en.length} SK:${sk.length} CS:${cs.length} — all in sync.`);
}
