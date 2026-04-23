# eslint-plugin-next-compat

[English](README.md) | [한국어](README.ko.md)

Next.js App Router 프로젝트에서 **클라이언트 컴포넌트만** 자동으로 감지하여 브라우저 호환성을 검사하는 ESLint 플러그인입니다.

이 플러그인은 내부적으로 [eslint-plugin-compat](https://github.com/amilajack/eslint-plugin-compat)을 사용하며, eslint-plugin-compat의 규칙을 래핑한 형태입니다.

![demo](https://raw.githubusercontent.com/dkpark10/eslint-plugin-next-compat/master/demo.gif)

## 왜 사용해야 하나요?

Next.js App Router에서는 서버 컴포넌트와 클라이언트 컴포넌트가 공존합니다. 브라우저 호환성 검사는 **클라이언트 컴포넌트**에만 필요하지만, 기존 도구들은 이를 구분하지 못합니다.

이 플러그인은 클라이언트 컴포넌트를 감지하고 **모든 의존성을 추적**하여 클라이언트 코드를 검사합니다.

## 클라이언트 코드 식별 기준

> **참고**
> 의존성 파일을 추적할 때 barrel index 패턴을 사용하면 서버에서 실행되는 파일도 린트 검사 대상에 포함될 수 있습니다.

이 플러그인은 아래 조건에 해당하는 코드를 클라이언트 코드로 판별합니다.

1. `src/app/**` 또는 `app/**` 디렉토리의 모든 `.tsx`, `.jsx` 컴포넌트 파일을 스캔
2. `layots.tsx`, `page.tsx` 파일을 진입점으로 [dependency-tree](https://www.npmjs.com/package/dependency-tree)를 활용해 의존성 수집
3. `'use client'` 지시어가 있는 파일을 식별
4. `'use server'` 지시어가 있는 파일을 제외
5. `server-only` 모듈을 제외


## 설치

> **요구 사항**
> ESLint 9+ (Flat Config만 지원)

```bash
npm install eslint-plugin-next-compat --save-dev
# 또는
pnpm add -D eslint-plugin-next-compat
```

## 사용법

> **참고**
> 클라이언트 파일은 ESLint가 시작될 때 감지됩니다. 클라이언트 컴포넌트를 추가하거나 삭제한 경우, ESLint 서버(또는 IDE)를 재시작해야 변경 사항이 반영됩니다.

### 기본 사용법

```js
// eslint.config.js
import nextCompat from 'eslint-plugin-next-compat';

export default [
  ...nextCompat.configs.recommended,
];
```

### 옵션 사용

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

| 옵션 | 타입 | 설명 |
|------|------|------|
| `include` | `string[]` | 추가로 검사할 glob 패턴 |
| `exclude` | `string[]` | 검사에서 제외할 glob 패턴 |

### Strict 모드

`warn` 대신 `error`를 사용합니다.

```js
export default [
  ...nextCompat.configs.strict,
];
```

### 대상 브라우저 설정

`.browserslistrc` 파일이나 `package.json`의 `browserslist` 필드에서 설정합니다.

`.browserslistrc` 파일이나 `package.json`의 `browserslist` 필드가 없을 경우, Next.js 버전을 자동으로 감지하여 해당 버전이 요구하는 브라우저 버전을 기준으로 검사합니다.

```
# .browserslistrc
last 2 versions
not dead
not ie 11
```

### 폴리필

이미 폴리필된 API를 검사에서 제외합니다.

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

### `getClientFiles`로 `eslint-plugin-compat` 직접 사용하기

이 플러그인 대신 `eslint-plugin-compat`을 직접 사용하고 싶다면, 내보낸 `getClientFiles` 유틸리티로 클라이언트 컴포넌트 파일만 대상으로 지정할 수 있습니다.

```js
// eslint.config.js
import compatPlugin from 'eslint-plugin-compat';
import { getClientFiles } from 'eslint-plugin-next-compat';

export default [
  {
    files: getClientFiles(),
    plugins: {
      compat: compatPlugin,
    },
    settings: {
      targets: [
        'chrome 64',
        'edge 79',
        'firefox 67',
        'opera 51',
        'safari 12',
      ],
    },
    rules: {
      'compat/compat': 'warn',
    },
  },
];
```

`getClientFiles()`는 선택적 옵션 객체를 받습니다:

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `cwd` | `string` | `process.cwd()` | 프로젝트 루트 디렉토리 |
| `appDir` | `string` | 자동 감지 | app 디렉토리 (`'app'` 또는 `'src/app'`) |
| `tsConfigPath` | `string` | 자동 감지 | `tsconfig.json` 또는 `jsconfig.json` 경로 |

## 라이선스

MIT
