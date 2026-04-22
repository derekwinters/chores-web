Run the full test suite for both frontend and backend. If any tests fail, stop and report the failures — do not proceed with the commit.

If all tests pass, stage any unstaged changes the user intended to commit, then create a commit using Conventional Commits format:

```
<type>(<scope>): <short description>

[optional body explaining why]
```

Types: feat, fix, refactor, test, docs, chore, style, perf, ci
Scopes: frontend, backend, api, auth (use the most relevant one)

Rules:
- Subject line ≤72 characters, lowercase, no trailing period
- Imperative mood: "add" not "added"
- Body only when the "why" is non-obvious

Steps:
1. Run `cd frontend && npm test`
2. Run `cd backend && pytest`
3. If both pass, inspect `git diff --staged` and `git status` to understand the changes
4. Derive the commit type and scope from the actual changes
5. Write and execute the commit
