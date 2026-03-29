# eslint-plugin-next-compat

[English](README.md) | [한국어](README.ko.md)

ESLint plugin that automatically detects **client components only** in Next.js App Router projects and checks browser compatibility.

This plugin uses [eslint-plugin-compat](https://github.com/amilajack/eslint-plugin-compat) internally and wraps its rules.

![demo](https://raw.githubusercontent.com/dkpark10/eslint-plugin-next-compat/master/demo.gif)

## Why Use This?

In Next.js App Router, server and client components coexist. Browser compatibility checks are only needed for **client components**, but existing tools can't distinguish between them.

This plugin detects client components and **tracks all their dependencies**, ensuring complete coverage of client-side code.

## Client Code Detection

> **Note**
> When tracking dependency files with barrel index patterns, server-side files may also be included in lint checks.

This plugin identifies client code based on the following criteria:

1. Scans all `.tsx`, `.jsx` component files in `src/app/**` or `app/**` directories
2. Identifies files with `'use client'` directive
3. Analyzes dependency tree of those files
4. Applies [eslint-plugin-compat](https://github.com/amilajack/eslint-plugin-compat) rules to identified client files

## Installation

> **Requirements**
> ESLint 9+ (Flat Config only)

```bash
npm install eslint-plugin-next-compat --save-dev
# or
pnpm add -D eslint-plugin-next-compat
```

## Usage

> **Note**
> Client files are detected when ESLint starts. If you add or remove client components, restart your ESLint server (or IDE) to detect the changes.

### Basic

```js
// eslint.config.js
import nextCompat from 'eslint-plugin-next-compat';

export default [
  ...nextCompat.configs.recommended,
];
```

### With Options

```js
// eslint.config.js
import nextCompat from 'eslint-plugin-next-compat';

export default [
  ...nextCompat.configs.recommended({
    include: ['src/hooks/**', 'src/utils/client/**'],
    exclude: ['**/*.test.ts', '**/legacy/**'],
  }),
];
```

| Option | Type | Description |
|--------|------|-------------|
| `include` | `string[]` | Additional glob patterns to check |
| `exclude` | `string[]` | Glob patterns to exclude from checking |

### Strict Mode

Use `error` instead of `warn`.

```js
export default [
  ...nextCompat.configs.strict,
];
```

### Target Browsers

Configure via `.browserslistrc` or `browserslist` field in `package.json`.

If neither `.browserslistrc` nor the `browserslist` field in `package.json` exists, the plugin automatically detects the Next.js version and uses its required browser versions as the baseline.

```
# .browserslistrc
last 2 versions
not dead
not ie 11
```

### Polyfills

Exclude APIs that are already polyfilled.

```js
// eslint.config.js
export default [
  ...nextCompat.configs.recommended,
  {
    settings: {
      polyfills: ['fetch', 'Promise', 'IntersectionObserver'],
    },
  },
];
```

## License

MIT
