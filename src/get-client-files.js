import { globSync } from 'glob';
import fs from 'fs';
import path from 'path';
import dependencyTree from 'dependency-tree';

const USE_CLIENT_REGEX = /^(?:\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*['"]use client['"]/;

/**
 * @typedef {Object} GetClientFilesOptions
 * @property {string} [appDir] - App directory path (default: 'src/app')
 * @property {string} [cwd] - Project root directory (default: process.cwd())
 * @property {string} [tsConfigPath] - tsconfig.json path (default: 'tsconfig.json')
 */

/**
 * Get all client component files including their dependencies
 * @param {GetClientFilesOptions} [options]
 * @returns {string[]}
 */
export function getClientFiles(options = {}) {
  const {
    appDir = 'src/app',
    cwd = process.cwd(),
    tsConfigPath = 'tsconfig.json',
  } = options;

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
              !depPath.includes('node_modules') &&
              !depPath.endsWith('.css') &&
              !depPath.endsWith('.scss'),
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
