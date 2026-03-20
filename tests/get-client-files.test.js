import { it, expect } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';
import { getClientFiles } from '../src/get-client-files.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXAMPLE_PATH = path.resolve(__dirname, '../example');

it('should detect all client files', () => {
  const result = getClientFiles({
    appDir: 'src/app',
    cwd: EXAMPLE_PATH,
    tsConfigPath: 'tsconfig.json',
  });

  expect(result.sort()).toEqual([
    'src/app/client-deps/page.tsx',
    'src/app/composition/_components/client-wrapper.tsx',
    'src/app/jsx-example/page.jsx',
    'src/app/nested-client/_components/child-no-directive.tsx',
    'src/app/nested-client/_components/client-parent.tsx',
    'src/components/client-component.tsx',
    'src/hooks/useBrowserInfo.ts',
    'src/hooks/useClipboard.ts',
    'src/hooks/useLocalStorage.ts',
    'src/hooks/useWindowSize.ts',
    'src/utils/browser-api.ts',
    'src/utils/format.ts',
    'src/utils/storage.ts',
    'src/utils/structed-clone.ts',
  ]);
});
