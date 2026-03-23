import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getBrowserslist } from '../src/get-browserslist.js';
import { NEXTJS_BROWSERSLIST } from '../src/get-browserslist.js';

describe('getBrowserslist', () => {
  describe('example/next2 (Next.js 16) - has .browserslistrc', () => {
    const next2Dir = path.resolve(__dirname, '../example/next2');

    it('should return null because .browserslistrc exists', () => {
      const result = getBrowserslist(next2Dir);

      // User config takes priority
      expect(result).toBeNull();
    });
  });

  describe('Next.js version detection (without .browserslistrc)', () => {
    const next1Dir = path.resolve(__dirname, '../example/next1');
    const next2Dir = path.resolve(__dirname, '../example/next2');

    const next1BrowserslistPath = path.join(next1Dir, '.browserslistrc');
    const next2BrowserslistPath = path.join(next2Dir, '.browserslistrc');

    let next1BrowserslistContent;
    let next2BrowserslistContent;

    beforeEach(() => {
      if (fs.existsSync(next2BrowserslistPath)) {
        next2BrowserslistContent = fs.readFileSync(next2BrowserslistPath, 'utf-8');
        fs.unlinkSync(next2BrowserslistPath);
      }
    });

    afterEach(() => {
      // Restore .browserslistrc
      if (next1BrowserslistContent) {
        fs.writeFileSync(next1BrowserslistPath, next1BrowserslistContent);
      }
      if (next2BrowserslistContent) {
        fs.writeFileSync(next2BrowserslistPath, next2BrowserslistContent);
      }
    });

    it('should detect Next.js 15 and return correct browserslist', () => {
      const result = getBrowserslist(next1Dir);

      expect(result).toEqual(NEXTJS_BROWSERSLIST['15']);
    });

    it('should detect Next.js 16 and return correct browserslist', () => {
      const result = getBrowserslist(next2Dir);

      expect(result).toEqual(NEXTJS_BROWSERSLIST['16']);
    });
  });

  describe('no Next.js project', () => {
    it('should return default browserslist when no package.json', () => {
      const result = getBrowserslist('/nonexistent/path');

      expect(result).toEqual(NEXTJS_BROWSERSLIST['15']);
    });
  });
});
