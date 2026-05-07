---
name: implementation-finalize
description: Commit changes and create pull request
---

# Implementation Finalize Skill

Creates conventional commit and opens pull request.

## Usage

```
/implementation-finalize <issue-number> <commit-type>
```

## Workflow

1. **Stage changes**: `git add -A`
2. **Create conventional commit**: 
   - Message: `<type>: <description> (#<number>)`
   - Body: Why, decisions, context
   - Footer: Co-Authored-By
3. **Push branch**: `git push -u origin <branch>`
4. **Create PR**: 
   - Title: conventional commit format
   - Body: Includes "Closes #<number>" on separate line per issue
   - Includes link to issue and plan
5. **Return PR URL**

## Parameters

- `issue_number` (required): GitHub issue number
- `commit_type` (required): Type of commit (feat, fix, refactor, docs, test)

## Output

- Commit created with message
- Branch pushed to origin
- PR created and URL returned
- Issue will auto-close when PR merged

## Notes

- Called by orchestrator after user approval
- Commit message follows conventional format
- PR body uses separate Closes lines per issue
- Each step reports success/failure
