import js from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      'coverage',
      '.turbo',
      '.next',
      'out',
      '*.min.*',
      '*.d.ts',
      '**/*.gen.*',
      'eslint.config.*',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2023,
      },
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        { 'ts-expect-error': 'allow-with-description' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'import/no-unresolved': 'off',
      'sort-imports': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-implicit-coercion': 'warn',
      eqeqeq: ['error', 'smart'],
      curly: ['error', 'all'],
      'prefer-const': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      parser: undefined,
      globals: {
        ...globals.node,
        ...globals.es2023,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prettier/prettier': 'error',
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      import: pluginImport,
    },
  },
  {
    files: ['**/*.{spec,test}.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      import: pluginImport,
    },
  },
];
