import type { Plugin } from "@opencode-ai/plugin";

export const LintPlugin: Plugin = async ({ $ }) => {
  return {
    "file.edited": async () => {
      await $`bun run check-write`;
      await $`bun run type-check`;
      await $`bun run test`;
    },
    "session.idle": async () => {
      await $`bun run build`;
    },
  };
};
