import { globSync } from 'glob';
import { minimatch } from 'minimatch';
import { getClientFiles } from './get-client-files.js';
import compatPlugin from 'eslint-plugin-compat';
const { name, version } = require('../package.json');

const PLUGIN_NAME = name.replace('eslint-plugin-', '');

/**
 * @typedef {Object} ConfigOptions
 * @property {string[]} [include] - Additional glob patterns to include as client files
 * @property {string[]} [exclude] - Glob patterns to exclude from client files
 */

/**
 * @typedef {((options?: ConfigOptions) => import('eslint').Linter.Config[]) & { [Symbol.iterator](): Generator<import('eslint').Linter.Config> }} ConfigFunction
 */

/**
 * @typedef {Object} NextCompatPlugin
 * @property {{ name: string; version: string }} meta
 * @property {Record<string, import('eslint').Rule.RuleModule>} rules
 * @property {{ recommended: ConfigFunction; strict: ConfigFunction }} configs
 */

/** @type {NextCompatPlugin} */
const plugin = {
  meta: {
    name,
    version,
  },

  rules: {
    compat: compatPlugin.rules.compat,
  },

  configs: /** @type {NextCompatPlugin['configs']} */ ({}),
};

/**
 * @param {string[]} [include]
 * @param {string[]} [exclude]
 * @returns {string[]}
 */
function getTargetFiles(include, exclude) {
  const additionalFiles = include?.flatMap((pattern) =>
    globSync(pattern, { ignore: ['**/node_modules/**'] })
  ) ?? [];

  const allFiles = [...new Set([...getClientFiles(), ...additionalFiles])];

  const filteredFiles = exclude?.length
    ? allFiles.filter((file) => !exclude.some((pattern) => minimatch(file, pattern)))
    : allFiles;

  return filteredFiles.length > 0 ? filteredFiles : ['__no_client_files__'];
}

/**
 * @param {'warn' | 'error'} severity
 * @param {ConfigOptions} [options]
 * @returns {import('eslint').Linter.Config[]}
 */
function createConfig(severity, options) {
  const targetFiles = getTargetFiles(options?.include, options?.exclude);

  return [
    {
      name: `${PLUGIN_NAME}/${severity === 'warn' ? 'recommended' : 'strict'}`,
      files: targetFiles,
      plugins: {
        [PLUGIN_NAME]: plugin,
      },
      rules: {
        [`${PLUGIN_NAME}/compat`]: severity,
      },
    },
  ];
}

/**
 * Create a config function that is also iterable (for spread without calling)
 * @param {'warn' | 'error'} severity
 * @returns {ConfigFunction}
 */
function createConfigFunction(severity) {
  /** @param {ConfigOptions} [options] */
  const fn = (options) => createConfig(severity, options);

  // Make it iterable so `...configs.recommended` works without ()
  fn[Symbol.iterator] = function* () {
    yield* createConfig(severity);
  };

  return /** @type {ConfigFunction} */ (fn);
}

plugin.configs = {
  recommended: createConfigFunction('warn'),
  strict: createConfigFunction('error'),
};

export { plugin };
export default plugin;
