import type { ESLint, Linter } from 'eslint';
import { processor, isClientComponent } from './processor';
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

  // Processor to filter compat messages for non-client files
  processors: {
    'client-compat': processor,
  },

  // Re-export eslint-plugin-compat's rules under our namespace
  rules: {
    compat: compatPlugin.rules!.compat,
  },

  configs: {},
};

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
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      [PLUGIN_NAME]: plugin,
    },
    processor: `${PLUGIN_NAME}/client-compat`,
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
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      [PLUGIN_NAME]: plugin,
    },
    processor: `${PLUGIN_NAME}/client-compat`,
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

// Export utilities
export { isClientComponent, processor };
export { plugin };
export default plugin;
