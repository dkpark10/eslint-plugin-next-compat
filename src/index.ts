import type { ESLint, Linter } from 'eslint';
import { getClientFiles } from './get-client-files';
import compatPlugin from 'eslint-plugin-compat';

const PLUGIN_NAME = 'next-compat';

interface NextCompatPlugin extends ESLint.Plugin {
  configs: Record<string, Linter.Config[]>;
}

const plugin: NextCompatPlugin = {
  meta: {
    name: `eslint-plugin-${PLUGIN_NAME}`,
    version: '0.0.1',
  },

  rules: {
    compat: compatPlugin.rules!.compat,
  },

  configs: {},
};

// Get client files at module load time
const clientFiles = getClientFiles();
const targetFiles = clientFiles.length > 0 ? clientFiles : ['__no_client_files__'];

/**
 * Recommended flat config - applies compat checking only to client components
 *
 * Usage in eslint.config.js:
 * ```js
 * import nextCompat from 'eslint-plugin-next-compat';
 *
 * export default [
 *   ...nextCompat.configs.recommended,
 * ];
 * ```
 */
const recommendedConfig: Linter.Config[] = [
  {
    name: `${PLUGIN_NAME}/recommended`,
    files: targetFiles,
    plugins: {
      [PLUGIN_NAME]: plugin,
    },
    rules: {
      [`${PLUGIN_NAME}/compat`]: 'warn',
    },
  },
];

/**
 * Strict flat config - treats compat issues as errors
 */
const strictConfig: Linter.Config[] = [
  {
    name: `${PLUGIN_NAME}/strict`,
    files: targetFiles,
    plugins: {
      [PLUGIN_NAME]: plugin,
    },
    rules: {
      [`${PLUGIN_NAME}/compat`]: 'error',
    },
  },
];

// Add configs to plugin
plugin.configs = {
  recommended: recommendedConfig,
  strict: strictConfig,
};

export { plugin };
export default plugin;
