import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      }],
      // Rule #2: ban all console.* across the codebase
      "no-console": "error",
    },
  },
  // lib/logger.ts is the console wrapper — allow all console methods inside it
  {
    files: ["lib/logger.ts"],
    rules: { "no-console": "off" },
  },
  // lib/server/env.ts: startup config degradation — console.warn only
  {
    files: ["lib/server/env.ts"],
    rules: { "no-console": ["error", { allow: ["warn"] }] },
  },
  // scripts/ are Node CLI tools — allow console output for user feedback
  {
    files: ["scripts/**/*.mjs", "scripts/**/*.js"],
    rules: { "no-console": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
