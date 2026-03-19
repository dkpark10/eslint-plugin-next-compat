import { globSync } from 'glob';
import fs from 'fs';
import path from 'path';
import dependencyTree from 'dependency-tree';

const USE_CLIENT_REGEX = /^(?:\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*['"]use client['"]/;

interface GetClientFilesOptions {
  /** App directory path (default: 'src/app') */
  appDir?: string;
  /** Project root directory (default: process.cwd()) */
  cwd?: string;
  /** tsconfig.json path (default: 'tsconfig.json') */
  tsConfigPath?: string;
}

/**
 * Get all client component files including their dependencies
 */
export function getClientFiles(options: GetClientFilesOptions = {}): string[] {
  const {
    appDir = 'src/app',
    cwd = process.cwd(),
    tsConfigPath = 'tsconfig.json',
  } = options;

  try {
    const srcPath = path.resolve(cwd, appDir);
    const tsConfigFullPath = path.resolve(cwd, tsConfigPath);

    // Get all tsx files in app directory
    const tsxFilePaths = globSync(`${srcPath}/**/*.tsx`, {
      ignore: ['**/node_modules/**'],
    });

    if (tsxFilePaths.length === 0) {
      return [];
    }

    // Get dependencies for a list of files
    function getDependencies(fileList: string[]): string[] {
      return fileList.reduce<string[]>((acc, filePath) => {
        try {
          const deps = dependencyTree.toList({
            filename: filePath,
            directory: cwd,
            filter: (depPath: string) =>
              !depPath.includes('node_modules') &&
              !depPath.endsWith('.css') &&
              !depPath.endsWith('.scss'),
            tsConfig: fs.existsSync(tsConfigFullPath) ? tsConfigFullPath : undefined,
          });
          return [...acc, ...deps];
        } catch {
          return acc;
        }
      }, []);
    }

    // Get all dependencies from tsx files
    const allDependencies = getDependencies(tsxFilePaths);

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
