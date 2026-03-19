import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import plugin from "../src/index";

const rule = plugin.rules!.compat;

function createRuleTester(targets: string, polyfills: string[] = []) {
  return new RuleTester({
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    settings: {
      targets,
      polyfills,
    },
  });
}

describe("next-compat/compat rule", () => {
  describe("old browsers (safari 12, chrome 64)", () => {
    const tester = createRuleTester("safari 12, chrome 64");

    it("valid - supported APIs", () => {
      tester.run("compat", rule, {
        valid: [
          { code: `const arr = [1, 2, 3]; arr.map(x => x * 2);` },
          { code: `Promise.resolve(1);` },
          { code: `fetch('/api');` },
        ],
        invalid: [],
      });
    });

    it("invalid - unsupported APIs", () => {
      tester.run("compat", rule, {
        valid: [],
        invalid: [
          {
            code: `structuredClone({ a: 1 });`,
            errors: [{ messageId: "compat" }],
          },
          {
            code: `const arr = [1, 2, 3]; arr.at(-1);`,
            errors: [{ messageId: "compat" }],
          },
          {
            code: `new BroadcastChannel('test');`,
            errors: [{ messageId: "compat" }],
          },
          {
            code: `new ResizeObserver(() => {});`,
            errors: [{ messageId: "compat" }],
          },
        ],
      });
    });
  });

  describe("modern browsers (chrome 100, safari 16)", () => {
    const tester = createRuleTester("chrome 100, safari 16");

    it("valid - all modern APIs supported", () => {
      tester.run("compat", rule, {
        valid: [
          { code: `structuredClone({ a: 1 });` },
          { code: `const arr = [1, 2, 3]; arr.at(-1);` },
          { code: `new BroadcastChannel('test');` },
          { code: `new ResizeObserver(() => {});` },
        ],
        invalid: [],
      });
    });
  });

  describe("very old browsers (ie 11)", () => {
    const tester = createRuleTester("ie 11");

    it("invalid - many APIs unsupported", () => {
      tester.run("compat", rule, {
        valid: [],
        invalid: [
          {
            code: `fetch('/api');`,
            errors: [{ messageId: "compat" }],
          },
          {
            code: `Promise.resolve(1);`,
            errors: [{ messageId: "compat" }],
          },
          {
            code: `new IntersectionObserver(() => {});`,
            errors: [{ messageId: "compat" }],
          },
        ],
      });
    });
  });

  describe("with polyfills", () => {
    describe("old browsers + fetch polyfill", () => {
      const tester = createRuleTester("ie 11", ["fetch"]);

      it("valid - polyfilled fetch", () => {
        tester.run("compat", rule, {
          valid: [{ code: `fetch('/api');` }],
          invalid: [],
        });
      });

      it("invalid - non-polyfilled Promise", () => {
        tester.run("compat", rule, {
          valid: [],
          invalid: [
            {
              code: `Promise.resolve(1);`,
              errors: [{ messageId: "compat" }],
            },
          ],
        });
      });
    });

    describe("old browsers + Promise polyfill", () => {
      const tester = createRuleTester("ie 11", ["Promise"]);

      it("valid - polyfilled Promise", () => {
        tester.run("compat", rule, {
          valid: [{ code: `Promise.resolve(1);` }],
          invalid: [],
        });
      });
    });

    describe("old browsers + multiple polyfills", () => {
      const tester = createRuleTester("ie 11", [
        "fetch",
        "Promise",
        "IntersectionObserver",
      ]);

      it("valid - all polyfilled APIs", () => {
        tester.run("compat", rule, {
          valid: [
            { code: `fetch('/api');` },
            { code: `Promise.resolve(1);` },
            { code: `new IntersectionObserver(() => {});` },
          ],
          invalid: [],
        });
      });
    });

    describe("safari 12 + structuredClone polyfill", () => {
      const tester = createRuleTester("safari 12", ["structuredClone"]);

      it("valid - polyfilled structuredClone", () => {
        tester.run("compat", rule, {
          valid: [{ code: `structuredClone({ a: 1 });` }],
          invalid: [],
        });
      });

      it("invalid - non-polyfilled Array.at", () => {
        tester.run("compat", rule, {
          valid: [],
          invalid: [
            {
              code: `const arr = [1, 2, 3]; arr.at(-1);`,
              errors: [{ messageId: "compat" }],
            },
          ],
        });
      });
    });
  });
});
