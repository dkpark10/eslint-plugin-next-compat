import { globSync } from "glob";
import { minimatch } from "minimatch";
import { getClientFiles } from "./get-client-files.js";
import { getBrowserslist, getNextVersion } from "./get-browserslist.js";
import compatPlugin from "eslint-plugin-compat";
const { name, version } = require("../package.json");

const PLUGIN_NAME = name.replace("eslint-plugin-", "");

/**
 * @todo If Nextjs version has been upgraded..
 */
const LATEST_NEXT_MAJOR = 16;

function getDocsUrl() {
  const nextVersion = getNextVersion();
  if (nextVersion && nextVersion < LATEST_NEXT_MAJOR) {
    return `https://nextjs.org/docs/${nextVersion}/architecture/supported-browsers`;
  }
  return "https://nextjs.org/docs/architecture/supported-browsers";
}

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
    compat: {
      meta: {
        ...compatPlugin.rules.compat.meta,
        docs: {
          ...compatPlugin.rules.compat.meta.docs,
          url: getDocsUrl(),
        },
      },
      create(context) {
        const sourceCode = context.getSourceCode?.() ?? context.sourceCode;
        const { body } = sourceCode.ast;
        const hasUseServer = body.some(
          (node) =>
            node.type === 'ExpressionStatement' &&
            node.expression.type === 'Literal' &&
            node.expression.value === 'use server',
        );
        if (hasUseServer) return {};

        const hasServerOnly = body.some(
          (node) =>
            node.type === 'ImportDeclaration' &&
            node.source.value === 'server-only',
        );
        if (hasServerOnly) return {};

        return compatPlugin.rules.compat.create(context);
      },
    },
  },

  configs: /** @type {NextCompatPlugin['configs']} */ ({}),
};

/**
 * @param {string[]} [include]
 * @param {string[]} [exclude]
 * @returns {string[]}
 */
function getTargetFiles(include, exclude) {
  const additionalFiles =
    include?.flatMap((pattern) =>
      globSync(pattern, { ignore: ["**/node_modules/**"] }),
    ) ?? [];

  const allFiles = [...new Set([...getClientFiles(), ...additionalFiles])];

  const filteredFiles = exclude?.length
    ? allFiles.filter(
        (file) => !exclude.some((pattern) => minimatch(file, pattern)),
      )
    : allFiles;

  return filteredFiles.length > 0 ? filteredFiles : ["__no_client_files__"];
}

/**
 * @param {'warn' | 'error'} severity
 * @param {ConfigOptions} [options]
 * @returns {import('eslint').Linter.Config[]}
 */
function createConfig(severity, options) {
  const targetFiles = getTargetFiles(options?.include, options?.exclude);
  const browserslist = getBrowserslist();

  /** @type {import('eslint').Linter.Config} */
  const config = {
    name: `${PLUGIN_NAME}/${severity === "warn" ? "recommended" : "strict"}`,
    files: targetFiles,
    plugins: {
      [PLUGIN_NAME]: plugin,
    },
    rules: {
      [`${PLUGIN_NAME}/compat`]: severity,
    },
  };

  // Auto-set browserslist if user doesn't have one
  if (browserslist) {
    config.settings = {
      targets: browserslist,
    };
  }

  return [config];
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

Object.assign(plugin.configs, {
  recommended: createConfigFunction("warn"),
  strict: createConfigFunction("error"),
});

export { plugin };
export default plugin;
