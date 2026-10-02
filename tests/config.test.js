import { describe, it, expect, vi, afterEach } from 'vitest';
import path from 'path';
import { ESLint } from 'eslint';
import { globSync } from 'glob';
import plugin, { getClientFiles } from '../src/index';

describe('plugin.configs', () => {
  describe('recommended', () => {
    it('should be iterable (spread without calling)', () => {
      const configs = [...plugin.configs.recommended];
      expect(configs).toHaveLength(1);
      expect(configs[0].name).toBe('next-compat/recommended');
      expect(configs[0].rules).toHaveProperty('next-compat/compat', 'warn');
    });

    it('should be callable with no options', () => {
      const configs = plugin.configs.recommended();
      expect(configs).toHaveLength(1);
      expect(configs[0].name).toBe('next-compat/recommended');
    });

    it('should accept include option', () => {
      const configs = plugin.configs.recommended({
        include: ['src/hooks/**'],
      });
      expect(configs).toHaveLength(1);
      expect(configs[0].files).toBeDefined();
    });

    it('should accept exclude option', () => {
      const configs = plugin.configs.recommended({
        exclude: ['**/*.test.ts'],
      });
      expect(configs).toHaveLength(1);
      expect(configs[0].files).toBeDefined();
    });

    it('should accept both include and exclude options', () => {
      const configs = plugin.configs.recommended({
        include: ['src/hooks/**'],
        exclude: ['**/legacy/**'],
      });
      expect(configs).toHaveLength(1);
      expect(configs[0].files).toBeDefined();
    });
  });

  describe('files matching', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    // Detected client files must actually be linted, and nothing else.
    // Guards against glob-pattern mismatches like `[slug]` being read as a character class.
    it.each(['next1', 'next2', 'next-jsx'])(
      'should apply the rule to exactly the detected client files (%s)',
      async (example) => {
        const EXAMPLE_PATH = path.resolve(__dirname, '../example', example);
        vi.spyOn(process, 'cwd').mockReturnValue(EXAMPLE_PATH);

        const clientFiles = getClientFiles({ cwd: EXAMPLE_PATH });
        expect(clientFiles.length).toBeGreaterThan(0);

        const eslint = new ESLint({
          cwd: EXAMPLE_PATH,
          overrideConfigFile: true,
          overrideConfig: plugin.configs.recommended(),
        });

        const sourceFiles = globSync('**/*.{ts,tsx,js,jsx}', {
          cwd: EXAMPLE_PATH,
          ignore: ['**/node_modules/**', '.next/**', '*.config.*', 'next-env.d.ts'],
        });

        const linted = [];
        for (const file of sourceFiles) {
          const config = await eslint.calculateConfigForFile(file);
          if (config?.rules?.['next-compat/compat']) {
            linted.push(file);
          }
        }

        expect(linted.sort()).toEqual([...clientFiles].sort());
      },
    );
  });

  describe('strict', () => {
    it('should be iterable (spread without calling)', () => {
      const configs = [...plugin.configs.strict];
      expect(configs).toHaveLength(1);
      expect(configs[0].name).toBe('next-compat/strict');
      expect(configs[0].rules).toHaveProperty('next-compat/compat', 'error');
    });

    it('should be callable with include option', () => {
      const configs = plugin.configs.strict({
        include: ['src/utils/client/**'],
      });
      expect(configs).toHaveLength(1);
    });
  });
});
