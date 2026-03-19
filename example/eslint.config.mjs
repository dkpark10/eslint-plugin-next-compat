import nextCompat from 'eslint-plugin-next-compat';
import tseslint from 'typescript-eslint';

export default [
  // Ignore patterns
  {
    ignores: ['.next/**', 'node_modules/**'],
  },

  // TypeScript config
  ...tseslint.configs.recommended,

  // Apply next-compat plugin
  ...nextCompat.configs.recommended,
];
