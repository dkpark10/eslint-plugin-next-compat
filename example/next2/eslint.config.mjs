import nextCompat from 'eslint-plugin-next-compat';
import tseslint from 'typescript-eslint';

export default [
  // Ignore patterns
  {
    ignores: ['.next/**', 'node_modules/**'],
  },

  // TypeScript config
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      polyfills: [],
    },
  },

  // Apply next-compat (App Router with root app/)
  ...nextCompat.configs.recommended,
];
