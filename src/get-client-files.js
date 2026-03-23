import { globSync } from 'glob';
import fs from 'fs';
import path from 'path';
import dependencyTree from 'dependency-tree';

const USE_CLIENT_REGEX = /^(?:\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*['"]use client['"]/;

/**
 * @typedef {Object} GetClientFilesOptions
 * @property {string} [appDir] - App directory path (default: auto-detect 'app' or 'src/app')
 * @property {string} [cwd] - Project root directory (default: process.cwd())
 * @property {string} [tsConfigPath] - tsconfig.json path (default: 'tsconfig.json')
 */

/**
 * Detect app directory (app/ or src/app/)
 * @param {string} cwd
 * @returns {string | null}
 */
function detectAppDir(cwd) {
  const candidates = ['src/app', 'app'];
  for (const dir of candidates) {
    const fullPath = path.resolve(cwd, dir);
    if (fs.existsSync(fullPath)) {
      return dir;
    }
  }
  return null;
}

/**
 * Get all client component files including their dependencies
 * @param {GetClientFilesOptions} [options]
 * @returns {string[]}
 */
export function getClientFiles(options = {}) {
  const {
    cwd = process.cwd(),
    tsConfigPath = 'tsconfig.json',
  } = options;

  // Auto-detect app directory if not specified
  const appDir = options.appDir ?? detectAppDir(cwd);

  if (!appDir) {
    return [];
  }

  try {
    const srcPath = path.resolve(cwd, appDir);
    const tsConfigFullPath = path.resolve(cwd, tsConfigPath);

    // Get all tsx/jsx files in app directory
    const componentFiles = globSync(`${srcPath}/**/*.{tsx,jsx}`, {
      ignore: ['**/node_modules/**'],
    });

    if (componentFiles.length === 0) {
      return [];
    }

    // JS/TS 확장자만 허용 (svg, json, css 등 비-JS 파일 제외)
    const JS_EXTENSIONS = /\.(tsx?|jsx?|mjs|cjs)$/;

    /**
     * Get dependencies for a list of files
     * @param {string[]} fileList
     * @returns {string[]}
     */
    function getDependencies(fileList) {
      return fileList.reduce((acc, filePath) => {
        try {
          const deps = dependencyTree.toList({
            filename: filePath,
            directory: cwd,
            filter: (/** @type {string} */ depPath) =>
              !depPath.includes('node_modules') && JS_EXTENSIONS.test(depPath),
            tsConfig: fs.existsSync(tsConfigFullPath) ? tsConfigFullPath : undefined,
          });
          return [...acc, ...deps];
        } catch {
          return acc;
        }
      }, /** @type {string[]} */ ([]));
    }

    // Get all dependencies from component files
    const allDependencies = getDependencies(componentFiles);

    // Filter files that have "use client" directive
    const clientFiles = allDependencies.filter((filePath) => {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return USE_CLIENT_REGEX.test(content);
      } catch {
        return false;
      }
    });

    // Get all dependencies of client files (these are also client components)
    const clientDependencies = getDependencies(clientFiles);

    // Return unique file paths as relative glob patterns
    const uniqueFiles = [...new Set(clientDependencies)];

    // Convert to relative paths for ESLint files pattern
    return uniqueFiles.map((filePath) => {
      return path.relative(cwd, filePath);
    });
  } catch (err) {
    console.error('get-client-files error:', err);
    return [];
  }
}

export default getClientFiles;
