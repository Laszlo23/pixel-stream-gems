import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
/** @type {import("eslint").Linter.Config[]} */
const coreWebVitals = require("eslint-config-next/core-web-vitals");
/** @type {import("eslint").Linter.Config[]} */
const typescript = require("eslint-config-next/typescript");

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  {
    rules: {
      // React Compiler / hooks plugin flags many valid SSR-hydration and reset-on-key patterns; revisit incrementally.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
    },
  },
];

export default eslintConfig;
