import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      "coverage",
      ".turbo",
      ".next",
      "out",
      "*.min.*",
      "*.d.ts",
      "**/*.gen.*",
      "eslint.config.*",
      "test/__mocks__/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  reactHooks.configs["recommended-latest"],
  reactRefresh.configs.vite,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module",
        ecmaVersion: "latest",
      },
      globals: {
        ...globals.browser,
        ...globals.es2023,
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "smart"],
      curly: ["error", "all"],
      "prefer-const": "error",
      "object-shorthand": ["error", "always"],
      "prefer-template": "error",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      parser: undefined,
      globals: { ...globals.browser, ...globals.es2023 },
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.{spec,test}.{ts,tsx,js,jsx}", "test/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);
