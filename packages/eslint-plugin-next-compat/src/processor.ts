import type { Linter } from 'eslint';

const USE_CLIENT_REGEX = /^['"]use client['"]\s*;?/m;

/**
 * Check if source code contains "use client" directive
 */
function isClientComponent(code: string): boolean {
  return USE_CLIENT_REGEX.test(code);
}

/**
 * ESLint Processor that filters compat rule messages
 * for files without "use client" directive
 */
export const processor: Linter.Processor = {
  /**
   * Preprocess: pass through the code as-is
   * We store whether it's a client component for postprocess
   */
  preprocess(text: string, filename: string) {
    // Store client status in a way postprocess can access
    // We use the filename as a key in a module-level cache
    clientFileCache.set(filename, isClientComponent(text));

    // Return the code as-is (string array preserves original filename mapping)
    return [text];
  },

  /**
   * Postprocess: filter out compat/* rule messages for non-client files
   */
  postprocess(messages: Linter.LintMessage[][], filename: string) {
    const isClient = clientFileCache.get(filename) ?? false;
    clientFileCache.delete(filename); // Clean up

    // Flatten messages from all code blocks
    const flatMessages = messages.flat();

    // If it's a client component, return all messages
    if (isClient) {
      return flatMessages;
    }

    // If not a client component, filter out next-compat/* rule messages
    return flatMessages.filter((msg) => {
      // Keep messages that are not from next-compat plugin
      return !msg.ruleId?.startsWith('next-compat/');
    });
  },

  supportsAutofix: true,
};

/**
 * Cache to track which files are client components
 * Used to pass information from preprocess to postprocess
 */
const clientFileCache = new Map<string, boolean>();

/**
 * Utility to check if a file is a client component
 */
export { isClientComponent };
