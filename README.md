# eslint-plugin-next-compat

ESLint plugin that automatically detects **client components only** in Next.js App Router projects and checks browser compatibility.

## Why?

In Next.js App Router, server and client components coexist. Browser compatibility checks are only needed for **client components**, but existing tools can't distinguish between them.

This plugin detects client components and **tracks all their dependencies**, ensuring complete coverage of client-side code.

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

This plugin uses [eslint-plugin-compat](https://github.com/amilajack/eslint-plugin-compat) internally, so all of its configuration options are supported.

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

Use `error` instead of `warn`:

```js
export default [
  ...nextCompat.configs.strict,
];
```

### Target Browsers

Configure via `.browserslistrc` or `browserslist` field in `package.json`:

```
# .browserslistrc
last 2 versions
not dead
not ie 11
```

### Polyfills

Exclude APIs that are already polyfilled:

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

## How It Works

1. Scans all `.tsx` files in `src/app` directory
2. Identifies files with `'use client'` directive
3. Analyzes dependency tree of those files
4. Applies [eslint-plugin-compat](https://github.com/amilajack/eslint-plugin-compat) rules to identified client files

## License

MIT
