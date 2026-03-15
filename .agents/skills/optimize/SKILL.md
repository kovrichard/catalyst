---
name: optimize
description: Scans the repository for optimization opportunities — complexity, performance issues, large files, and maintainability problems — and fixes them one at a time with user confirmation. Use only when the user explicitly invokes this skill.
disable-model-invocation: true
---

# Optimize

When this skill is invoked, the agent should do the following:

## What to look for

Scan the full codebase (`src/`) for the following categories of issues, ordered from easiest wins to bigger refactors:

- **File size / split candidates** — files over ~300 lines that contain multiple distinct responsibilities; components that mix data-fetching with presentation; large utility files where functions could be grouped by domain.
- **Component complexity** — components with too many props, deeply nested JSX, or logic that belongs in a custom hook.
- **Duplicate / near-duplicate logic** — repeated patterns across files that could be extracted into a shared hook, util, or DAO function.
- **Unnecessary re-renders** — missing `memo`, missing `useCallback`/`useMemo`, derived state computed in render body instead of memoized, objects/arrays created inline as props.
- **Performance bottlenecks** — N+1 queries in DAOs, missing `Promise.all` for independent async calls in server components, expensive operations not cached.
- **Dead code** — unused exports, unreachable branches, commented-out code blocks.
- **Trivial readability** — deeply nested ternaries that could be a variable or early return; magic numbers/strings without a named constant.

## Workflow

1. **Scan first.** Read the relevant files — do not guess. Prioritize files flagged as large or complex by the file listing.

2. **Rank by effort vs. impact.** Pick the single highest-impact, lowest-effort issue (the "lowest hanging fruit").

3. **Present the finding** in this format:

```
📁 File: <path>
🔍 Issue: <one-sentence description>
💡 Fix: <one-sentence plan>

Write 'go' to apply this fix, or 'skip' to find the next one.
```

4. **Wait for the user to write `go`.** Do not make any edits until the user confirms.

5. **Apply the fix.** Make the smallest, most focused change that addresses the issue.

6. **After the fix**, immediately find the next lowest-hanging-fruit issue and present it in the same format. Return to step 4.

7. **If the user writes `skip`**, find the next issue without making changes.

8. **Keep looping** until the user says `stop`, `done`, or `exit`, or there are no more issues to report.

## Constraints

- **One change at a time.** Never batch multiple fixes into a single edit.
- **No speculative changes.** Only fix things you can see are actually a problem after reading the code.
- **Preserve behavior.** Refactors must not change observable behavior. If unsure, note the risk in the finding.
- **Respect AGENTS.md rules.** All existing architecture rules (data flow layers, critical file patterns, etc.) apply.
