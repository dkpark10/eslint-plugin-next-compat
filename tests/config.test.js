import { describe, it, expect } from 'vitest';
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
