import { describe, it, expect, vi, afterEach } from 'vitest';
import path from 'path';
import { ESLint } from 'eslint';
import plugin from '../src/index';

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

    it('should apply the rule to dynamic route files ([slug])', async () => {
      const EXAMPLE_PATH = path.resolve(__dirname, '../example/next1');
      vi.spyOn(process, 'cwd').mockReturnValue(EXAMPLE_PATH);

      const eslint = new ESLint({
        cwd: EXAMPLE_PATH,
        overrideConfigFile: true,
        overrideConfig: plugin.configs.recommended(),
      });
      const config = await eslint.calculateConfigForFile('src/app/blog/[slug]/page.tsx');

      expect(config?.rules?.['next-compat/compat']).toBeDefined();
    });
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
