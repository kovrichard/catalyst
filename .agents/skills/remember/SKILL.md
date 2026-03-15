---
name: remember
description: When the user invokes this skill, the agent reflects on the most important lessons learned recently and suggests adding a new rule to AGENTS.md to prevent the same issue from recurring. Use when the user explicitly invokes the remember skill.
disable-model-invocation: true
---

# Remember

When this skill is invoked, the agent should:

1. **Reflect** on the current or recent conversation: what went wrong, what was corrected, or what requirement was clarified that the agent should follow from now on.

2. **Propose a new rule** for `AGENTS.md` that:
   - States the requirement or constraint clearly.
   - Is written so a future agent (or you in a new context) will avoid repeating the same mistake or omission.

3. **Suggest the exact change**: Provide the exact markdown to add to `AGENTS.md` (e.g. a new bullet under an existing section, or a new subsection). Place it where it fits best—e.g. under "Coding guidelines", "Code organization", or "Critical files"—and keep it concise.

4. **Do not edit AGENTS.md yourself** unless the user explicitly asks you to apply the change. By default, only suggest the rule and show the proposed text; let the user review and approve before adding it.

## Example

User: Invokes `/remember`

Agent: Determines that we always use the dao for DB access, never prisma in components.

Agent: Reflects that this was a recurring mistake; suggests adding under "Coding guidelines" in AGENTS.md:

```markdown
- Use DAO functions for all database access from routes and components; never import `prisma` in components or route handlers.
```

Then asks whether the user wants this applied to AGENTS.md.
