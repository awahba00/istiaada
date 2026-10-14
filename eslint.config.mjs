import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // Baseline for the whole repository (development scripts included):
    // intentionally relaxed — the one-shot tooling scripts are historical
    // audit/generation artifacts, not shipped code.
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/prefer-as-const": "off",
      "@typescript-eslint/no-unused-disable-directive": "off",

      // React rules
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/purity": "off",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
      "react-compiler/react-compiler": "off",

      // Next.js rules
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",

      // General JavaScript rules
      "prefer-const": "off",
      "no-unused-vars": "off",
      "no-console": "off",
      "no-debugger": "off",
      "no-empty": "off",
      "no-irregular-whitespace": "off",
      "no-case-declarations": "off",
      "no-fallthrough": "off",
      "no-mixed-spaces-and-tabs": "off",
      "no-redeclare": "off",
      "no-undef": "off",
      "no-unreachable": "off",
      "no-useless-escape": "off",

      // scripts/ QA tools report results as `cond ? ok(...) : bad(...)`
      // ternary statements by style (validate-knowledge.ts) — allowed in
      // the non-application baseline; src/ never uses the pattern.
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
  {
    // C3 — the APPLICATION-SOURCE quality gate. Everything the user's
    // browser runs (src/**) is held to a real bar: no `any`, no unused
    // code, no stray console logging (the app has no documented reason to
    // log), no unreachable code, const-correct declarations, and the React
    // hooks dependency/refs/state-in-effect rules that catch real bugs.
    // All surfaced violations are fixed, not suppressed.
    //
    // Deliberately still off for src/ (scoped decision, documented):
    //   react-hooks/purity — flags render-time Date.now() reads used
    //   intentionally as freshness heuristics in 3 display spots
    //   (DoseScreen recent-relapse copy, HomeScreen handled-recently
    //   label, sidebar Skeleton). Restructuring those into state would
    //   change re-render semantics in heavily-tested screens for zero
    //   user-visible gain.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": "error",
      "no-unreachable": "error",
      "prefer-const": "error",
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/refs": "error",
      "react-hooks/set-state-in-effect": "error",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "examples/**",
      "skills",
    ],
  },
];

export default eslintConfig;
