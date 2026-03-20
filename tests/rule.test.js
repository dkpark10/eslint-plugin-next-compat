import { RuleTester } from 'eslint';
import plugin from '../src/index';

const rule = plugin.rules.compat;

/**
 * @param {string} targets
 * @param {string[]} [polyfills]
 */
function createRuleTester(targets, polyfills = []) {
  return new RuleTester({
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    settings: {
      targets,
      polyfills,
    },
  });
}

// Old browsers (safari 12, chrome 64)
createRuleTester('safari 12, chrome 64').run('compat - old browsers', rule, {
  valid: [
    { code: `const arr = [1, 2, 3]; arr.map(x => x * 2);` },
    { code: `Promise.resolve(1);` },
    { code: `fetch('/api');` },
  ],
  invalid: [
    {
      code: `structuredClone({ a: 1 });`,
      errors: 1,
    },
    {
      code: `new BroadcastChannel('test');`,
      errors: 1,
    },
    {
      code: `new ResizeObserver(() => {});`,
      errors: 1,
    },
  ],
});

// Modern browsers (chrome 100, safari 16)
createRuleTester('chrome 100, safari 16').run('compat - modern browsers', rule, {
  valid: [
    { code: `structuredClone({ a: 1 });` },
    { code: `const arr = [1, 2, 3]; arr.at(-1);` },
    { code: `new BroadcastChannel('test');` },
    { code: `new ResizeObserver(() => {});` },
  ],
  invalid: [],
});

// Very old browsers (ie 11)
createRuleTester('ie 11').run('compat - ie 11', rule, {
  valid: [],
  invalid: [
    {
      code: `fetch('/api');`,
      errors: 1,
    },
    {
      code: `Promise.resolve(1);`,
      errors: 1,
    },
    {
      code: `new IntersectionObserver(() => {});`,
      errors: 1,
    },
  ],
});

// With polyfills
createRuleTester('ie 11', ['fetch']).run('compat - ie 11 + fetch polyfill', rule, {
  valid: [{ code: `fetch('/api');` }],
  invalid: [
    {
      code: `Promise.resolve(1);`,
      errors: 1,
    },
  ],
});

createRuleTester('ie 11', ['Promise']).run('compat - ie 11 + Promise polyfill', rule, {
  valid: [{ code: `Promise.resolve(1);` }],
  invalid: [],
});

createRuleTester('ie 11', ['fetch', 'Promise', 'IntersectionObserver']).run(
  'compat - ie 11 + multiple polyfills',
  rule,
  {
    valid: [
      { code: `fetch('/api');` },
      { code: `Promise.resolve(1);` },
      { code: `new IntersectionObserver(() => {});` },
    ],
    invalid: [],
  }
);

createRuleTester('safari 12', ['structuredClone']).run(
  'compat - safari 12 + structuredClone polyfill',
  rule,
  {
    valid: [{ code: `structuredClone({ a: 1 });` }],
    invalid: [],
  }
);
