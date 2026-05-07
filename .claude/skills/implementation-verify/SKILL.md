---
name: implementation-verify
description: Verify Docker deployment and show changes summary
---

# Implementation Verify Skill

Rebuilds Docker containers and shows summary of changes for user review.

## Usage

```
/implementation-verify <issue-number>
```

## Workflow

1. **Docker rebuild**: `docker compose up --build -d`
2. **Verify containers**: Check all containers running
3. **Prepare changes summary**:
   - List all files modified
   - Show line change counts
   - Summarize implementation
   - Display test results
4. **Pause workflow**: Wait for user approval or request for changes

## Parameters

- `issue_number` (optional): For reference in output

## Output

Shows:
- Files modified with line counts
- Implementation summary
- Test results
- Docker status
- Ready for user to:
  - Approve for commit
  - Request more changes
  - Abort

## Notes

- Called by orchestrator after tests pass
- Docker rebuild verifies containerized environment
- Shows all changes before user reviews
- User has control point here
