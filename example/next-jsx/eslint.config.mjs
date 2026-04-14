import nextCompat from 'eslint-plugin-next-compat';

export default [
  {
    ignores: ['.next/**', 'node_modules/**'],
  },

  // Enable JSX parsing for JS/JSX files
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // Apply next-compat (App Router with src/app)
  ...nextCompat.configs.recommended,
];
