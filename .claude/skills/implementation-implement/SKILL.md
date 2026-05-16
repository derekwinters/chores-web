---
name: implementation-implement
description: Implement code changes for GitHub issue
---

# Implementation Implement Skill

Implements code changes to address GitHub issue requirements.

## Usage

```
/implementation-implement <issue-number>
```

## Workflow

1. **Fetch issue details**: Get issue title, body, and existing comments
2. **Read implementation plan**: Check for plan posted in issue comments
3. **Update documentation (pre-work)**: Before writing code, update docs/ pages listed in the plan
   - Read each affected doc page from the plan's documentation section
   - Draft documentation changes to reflect planned behavior
   - Stage doc changes alongside code
4. **Identify affected layers**:
   - Database: Schema changes, migrations
   - Backend: Services, routers, schemas
   - Frontend: Components, API client, UI
5. **Implement changes**: Make code modifications per plan
6. **Review and correct documentation (post-work)**: After code changes are complete
   - Re-read all modified doc pages
   - Verify docs accurately reflect the actual implementation
   - Correct any discrepancies; add coverage for new behavior
7. **Track changes**: Note which files modified and impact
8. **Report summary**: Show files changed and what was implemented

## Implementation Scope

Follows structured plan from planning phase:
- Specific files to change (exact paths)
- Implementation steps (concrete, ordered)
- Testing approach (unit + integration)
- Challenges and mitigations

## Output

- List of files modified with line change counts
- Summary of implementation completed
- Any blocking issues encountered
- Ready for testing phase

## Notes

- Called by orchestrator after branch preparation
- Should follow implementation plan from planning phase
- Track all file changes for later commit
- Report blocking issues to pause workflow
