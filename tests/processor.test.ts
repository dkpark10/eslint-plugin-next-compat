import { describe, it, expect } from 'vitest';
import { processor, isClientComponent } from '../src/processor';
import type { Linter } from 'eslint';

describe('isClientComponent', () => {
  it('should return true for files with "use client" (single quotes)', () => {
    const code = `'use client';\n\nexport default function Component() {}`;
    expect(isClientComponent(code)).toBe(true);
  });

  it('should return true for files with "use client" (double quotes)', () => {
    const code = `"use client";\n\nexport default function Component() {}`;
    expect(isClientComponent(code)).toBe(true);
  });

  it('should return true for files with "use client" without semicolon', () => {
    const code = `'use client'\n\nexport default function Component() {}`;
    expect(isClientComponent(code)).toBe(true);
  });

  it('should return false for server components', () => {
    const code = `export default function ServerComponent() {}`;
    expect(isClientComponent(code)).toBe(false);
  });

  it('should return false for files with "use server"', () => {
    const code = `'use server';\n\nexport async function action() {}`;
    expect(isClientComponent(code)).toBe(false);
  });

  it('should return false for "use client" in string literal (not directive)', () => {
    const code = `const x = 'use client';\nexport default function Component() {}`;
    expect(isClientComponent(code)).toBe(false);
  });
});

describe('processor', () => {
  describe('preprocess', () => {
    it('should return code block with text and filename', () => {
      const code = `'use client';\nexport default function Component() {}`;
      const result = processor.preprocess!(code, 'test.tsx');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ text: code, filename: 'test.tsx' });
    });
  });

  describe('postprocess', () => {
    it('should keep all messages for client components', () => {
      const code = `'use client';\nnew IntersectionObserver(() => {});`;
      processor.preprocess!(code, 'client.tsx');

      const messages: Linter.LintMessage[][] = [
        [
          {
            ruleId: 'next-compat/compat',
            severity: 2,
            message: 'IntersectionObserver is not supported',
            line: 2,
            column: 1,
            nodeType: 'NewExpression',
          } as Linter.LintMessage,
          {
            ruleId: 'no-unused-vars',
            severity: 1,
            message: 'x is unused',
            line: 1,
            column: 1,
            nodeType: 'Identifier',
          } as Linter.LintMessage,
        ],
      ];

      const result = processor.postprocess!(messages, 'client.tsx');

      expect(result).toHaveLength(2);
      expect(result[0].ruleId).toBe('next-compat/compat');
      expect(result[1].ruleId).toBe('no-unused-vars');
    });

    it('should filter out next-compat/* messages for server components', () => {
      const code = `export default function ServerComponent() {}`;
      processor.preprocess!(code, 'server.tsx');

      const messages: Linter.LintMessage[][] = [
        [
          {
            ruleId: 'next-compat/compat',
            severity: 2,
            message: 'IntersectionObserver is not supported',
            line: 2,
            column: 1,
            nodeType: 'NewExpression',
          } as Linter.LintMessage,
          {
            ruleId: 'no-unused-vars',
            severity: 1,
            message: 'x is unused',
            line: 1,
            column: 1,
            nodeType: 'Identifier',
          } as Linter.LintMessage,
        ],
      ];

      const result = processor.postprocess!(messages, 'server.tsx');

      // Should only have non-compat messages
      expect(result).toHaveLength(1);
      expect(result[0].ruleId).toBe('no-unused-vars');
    });

    it('should keep non-compat messages for server components', () => {
      const code = `export default function ServerComponent() {}`;
      processor.preprocess!(code, 'server2.tsx');

      const messages: Linter.LintMessage[][] = [
        [
          {
            ruleId: 'no-console',
            severity: 1,
            message: 'Unexpected console statement',
            line: 1,
            column: 1,
            nodeType: 'CallExpression',
          } as Linter.LintMessage,
        ],
      ];

      const result = processor.postprocess!(messages, 'server2.tsx');

      expect(result).toHaveLength(1);
      expect(result[0].ruleId).toBe('no-console');
    });
  });
});
