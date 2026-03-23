import fs from 'fs';
import path from 'path';

/**
 * Next.js version-specific browser support
 * @see https://nextjs.org/docs/architecture/supported-browsers
 * @see https://nextjs.org/docs/15/architecture/supported-browsers
 */
export const NEXTJS_BROWSERSLIST = {
  // Next.js 16+
  16: [
    'chrome 111',
    'edge 111',
    'firefox 111',
    'safari 16.4',
  ],
  // Next.js 15 and below
  15: [
    'chrome 64',
    'edge 79',
    'firefox 67',
    'opera 51',
    'safari 12',
  ],
};

/**
 * Detect Next.js version from package.json
 * @param {string} [cwd]
 * @returns {number | null}
 */
export function getNextVersion(cwd = process.cwd()) {
  try {
    const pkgPath = path.resolve(cwd, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      return null;
    }

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const nextVersion = pkg.dependencies?.next || pkg.devDependencies?.next;

    if (!nextVersion) {
      return null;
    }

    // Extract major version (e.g., "^14.2.0" -> 14, "15.0.0-rc.1" -> 15)
    const match = nextVersion.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  } catch {
    return null;
  }
}

/**
 * Check if user has their own browserslist config
 * @param {string} [cwd]
 * @returns {boolean}
 */
function hasBrowserslistConfig(cwd = process.cwd()) {
  const files = ['.browserslistrc', 'browserslist'];

  for (const file of files) {
    if (fs.existsSync(path.resolve(cwd, file))) {
      return true;
    }
  }

  // Check package.json for browserslist field
  try {
    const pkgPath = path.resolve(cwd, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (pkg.browserslist) {
        return true;
      }
    }
  } catch {
    // ignore
  }

  return false;
}

/**
 * Get browserslist based on Next.js version
 * Returns null if user has their own browserslist config
 * @param {string} [cwd]
 * @returns {string[] | null}
 */
export function getBrowserslist(cwd = process.cwd()) {
  // User's browserslist takes priority
  if (hasBrowserslistConfig(cwd)) {
    return null;
  }

  const nextVersion = getNextVersion(cwd);

  if (!nextVersion) {
    // No Next.js detected, use Next.js 15 default
    return NEXTJS_BROWSERSLIST[15];
  }

  // Next.js 16+
  if (nextVersion >= 16) {
    return NEXTJS_BROWSERSLIST[16];
  }

  // Next.js 15 and below
  return NEXTJS_BROWSERSLIST[15];
}

export default getBrowserslist;
