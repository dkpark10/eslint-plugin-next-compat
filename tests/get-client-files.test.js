import { describe, test, expect } from "vitest";
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";
import { getClientFiles } from "../src/get-client-files.js";

/**
 * @param {string} nextVersion
 */
function makeInstrumentationClientProject(nextVersion) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "next-compat-"));
  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify({ dependencies: { next: nextVersion } }),
  );
  fs.writeFileSync(
    path.join(dir, "instrumentation-client.ts"),
    "structuredClone({ init: true });\n",
  );
  return dir;
}

describe("should detect all client files", () => {
  test("src/app", () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const EXAMPLE_PATH = path.resolve(__dirname, "../example/next1");

    const result = getClientFiles({
      cwd: EXAMPLE_PATH,
    });

    expect(result).not.toContain("src/app/api/hello/route.ts");
    expect(result).not.toContain("src/utils/server-only-util.ts");
    expect(result.sort()).toEqual([
      "src/app/blog/[slug]/page.tsx",
      "src/app/client-deps/page.tsx",
      "src/app/composition/_components/client-wrapper.tsx",
      "src/app/jsx-example/page.jsx",
      "src/app/lazy-loading/_components/click-to-load-component.tsx",
      "src/app/lazy-loading/_components/dynamic-component.tsx",
      "src/app/lazy-loading/_components/lazy-component.tsx",
      "src/app/lazy-loading/page.tsx",
      "src/app/nested-client/_components/child-no-directive.tsx",
      "src/app/nested-client/_components/client-parent.tsx",
      "src/components/client-component.tsx",
      "src/hooks/useBrowserInfo.ts",
      "src/hooks/useClipboard.ts",
      "src/hooks/useLocalStorage.ts",
      "src/hooks/useWindowSize.ts",
      "src/instrumentation-client.ts",
      "src/utils/browser-api.ts",
      "src/utils/format.ts",
      "src/utils/storage.ts",
      "src/utils/structed-clone.ts",
    ]);
  });

  test("root/app", () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const EXAMPLE_PATH = path.resolve(__dirname, "../example/next2");

    const result = getClientFiles({
      cwd: EXAMPLE_PATH,
    });

    expect(result.sort()).toEqual(["app/page.tsx", "instrumentation-client.ts"]);
  });

  test("next-jsx", () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const EXAMPLE_PATH = path.resolve(__dirname, "../example/next-jsx");

    const result = getClientFiles({
      cwd: EXAMPLE_PATH,
    });

    expect(result).not.toContain("src/app/api/hello/route.js");
    expect(result.sort()).toEqual([
      "src/app/client-deps/page.jsx",
      "src/app/composition/_components/client-wrapper.jsx",
      "src/app/lazy-loading/_components/click-to-load-component.jsx",
      "src/app/lazy-loading/_components/dynamic-component.jsx",
      "src/app/lazy-loading/_components/lazy-component.jsx",
      "src/app/lazy-loading/page.jsx",
      "src/app/nested-client/_components/child-no-directive.jsx",
      "src/app/nested-client/_components/client-parent.jsx",
      "src/components/client-component.jsx",
      "src/hooks/useBrowserInfo.js",
      "src/hooks/useClipboard.js",
      "src/hooks/useLocalStorage.js",
      "src/hooks/useWindowSize.js",
      "src/utils/browser-api.js",
      "src/utils/format.js",
      "src/utils/storage.js",
      "src/utils/structed-clone.js",
    ]);
  });

  describe("instrumentation-client.ts", () => {
    test("included when Next.js version is 15+", () => {
      const dir = makeInstrumentationClientProject("^15.0.0");
      const result = getClientFiles({ cwd: dir });
      expect(result).toEqual(["instrumentation-client.ts"]);
    });

    test("not checked when Next.js version is below 15", () => {
      const dir = makeInstrumentationClientProject("^14.2.0");
      const result = getClientFiles({ cwd: dir });
      expect(result).toEqual([]);
    });
  });
});
