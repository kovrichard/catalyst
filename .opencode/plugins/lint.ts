import type { Plugin } from "@opencode-ai/plugin";

export const LintPlugin: Plugin = async ({ $ }) => {
  return {
    "file.edited": async () => {
      await $`bun run check`;
      await $`bun run type-check`;
      await $`bun run knip`;
      await $`bun run jscpd`;
      await $`bun run klint --json`;
      await $`bun run madge`;
      await $`bun run lf`;
      await $`bun run secretlint`;
    },
  };
};
