import { describe, it, expect } from "vitest";
import path from "path";
import { getClientFiles } from "../src/get-client-files";

const EXAMPLE_PATH = path.resolve(__dirname, "../example");

it("should detect all client files", () => {
  const result = getClientFiles({
    appDir: "src/app",
    cwd: EXAMPLE_PATH,
    tsConfigPath: "tsconfig.json",
  });

  expect(result.sort()).toEqual([
    "src/app/client-deps/page.tsx",
    "src/app/composition/_components/client-wrapper.tsx",
    "src/app/nested-client/_components/child-no-directive.tsx",
    "src/app/nested-client/_components/client-parent.tsx",
    "src/components/client-component.tsx",
    "src/hooks/useBrowserInfo.ts",
    "src/hooks/useClipboard.ts",
    "src/hooks/useLocalStorage.ts",
    "src/hooks/useWindowSize.ts",
    "src/utils/browser-api.ts",
    "src/utils/format.ts",
    "src/utils/storage.ts",
  ]);
});
