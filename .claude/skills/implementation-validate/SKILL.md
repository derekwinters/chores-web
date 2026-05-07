---
name: implementation-validate
description: Validate GitHub issue is ready for implementation
---

# Implementation Validate Skill

Validates that a GitHub issue is ready for implementation.

## Usage

```
/implementation-validate <issue-number>
```

## Workflow

1. **Fetch issue**: Get issue details from GitHub
2. **Check prerequisites**:
   - Issue must be OPEN
   - Issue must have `ready-for-work` label
   - Issue must NOT already have a branch in progress
3. **Determine commit type**: Analyze issue to determine correct commit type
   - `feat:` for features
   - `fix:` for bugs
   - `refactor:` for improvements
   - `docs:` for documentation
   - `test:` for test-only changes
4. **Return status**: Pass or fail validation with reasons

## Output

- ✅ Issue is valid and ready
  - Issue title and number
  - Commit type determined
  - Next step: branch creation
- ❌ Issue is not valid
  - Specific reason why (missing label, wrong state, etc.)
  - Recommended corrective action

## Notes

- Used by orchestrator as first step
- Can be called independently to verify issue state
- Does not modify issue or labels
