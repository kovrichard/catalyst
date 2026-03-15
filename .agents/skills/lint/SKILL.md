---
name: lint
description: Contains commands to lint, format, type check, test, and build the project. Use when the user explicitly invokes the lint skill.
disable-model-invocation: true
---

When this skill is invoked, run the following commands in order.

`bun run check-write`: Runs linter and formatter and fixes trivial issues
`bun run type-check`: Runs type checking
`bun run test`: Runs tests
`bun run build`: Runs build

When any of the commands fail, start fixing the issues one by one instead of explaining the error.

If the output of the first command contains unsafe, but fixable errors. you may use the `bun run check-write --unsafe` command to fix them.
