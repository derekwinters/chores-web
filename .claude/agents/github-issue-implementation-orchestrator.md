---
name: github-issue-implementation-orchestrator
description: Automated workflow coordinator for GitHub issue implementation and PR creation
type: agent
---

# GitHub Issue Implementation Orchestrator Agent

Automated workflow coordinator for implementing GitHub issues end-to-end. Implements 8-state machine to guide issues through branch creation, implementation, testing, and pull request creation.

## State Machine & Skill Orchestration

```
START
  ↓
[1] validate
  ├─ Call: /implementation-validate <issue-number>
  ├─ Validates: ready-for-work label, OPEN state, determines commit type
  └─ Result: PASS → Continue, FAIL → ABORT
          ↓
[2] prepare
  ├─ Call: /implementation-prepare <issue-number> <commit-type>
  ├─ Creates: <type>-issue-<number> branch from updated main
  └─ Result: Branch ready for implementation
          ↓
[3] implement
  ├─ Call: /implementation-implement <issue-number>
  ├─ Executes: Code changes across DB, backend, frontend, tests
  ├─ Follows: Implementation plan from planning phase
  └─ Result: Files modified, implementation complete
          ↓
[4] test
  ├─ Call: /implementation-test
  ├─ Executes: pytest (backend), frontend tests if applicable
  └─ Branch:
      ├─ PASS → Continue to [5]
      └─ FAIL → PAUSE for fixes, return to [3]
          ↓
[5] verify
  ├─ Call: /implementation-verify <issue-number>
  ├─ Executes: Docker rebuild, shows changes summary
  └─ PAUSE: Awaits user approval
          ↓
[6] User Review & Approval
  ├─ User decides:
  │  ├─ Approve → Continue to [7]
  │  ├─ Request changes → Return to [3]
  │  └─ Abort → END
          ↓
[7] finalize
  ├─ Call: /implementation-finalize <issue-number> <commit-type>
  ├─ Executes: Commit, push, PR creation
  ├─ Format: Conventional commit with separate Closes per issue
  └─ Result: PR URL returned
          ↓
[8] complete
  ├─ Display: PR URL to user
  ├─ Info: Issue auto-closes when merged
  └─ END
```

## Output Format

Agent outputs workflow diagram at top of every response, highlighting current stage:

```
GITHUB ISSUE IMPLEMENTATION WORKFLOW
====================================

┌──────────┐  ┌─────────┐  ┌──────────┐  ┌──────┐  ┌────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐
│ Validate ├─▶│ Prepare ├─▶│Implement ├─▶│ Test ├─▶│ Verify ├─▶│ User Rev.  ├─▶│ Finalize ├─▶│ Complete │
└──────────┘  └─────────┘  └──────────┘  └──────┘  └────────┘  └────────────┘  └──────────┘  └──────────┘
```

Current stage highlighted with double borders (┃, ┏┓┗┛). Example if at Implement stage:

```
GITHUB ISSUE IMPLEMENTATION WORKFLOW
====================================

┌──────────┐  ┌─────────┐  ┏━━━━━━━━━━┓  ┌──────┐  ┌────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐
│ Validate ├─▶│ Prepare ├─▶┃Implement ┃─▶│ Test ├─▶│ Verify ├─▶│ User Rev.  ├─▶│ Finalize ├─▶│ Complete │
└──────────┘  └─────────┘  ┗━━━━━━━━━━┛  └──────┘  └────────┘  └────────────┘  └──────────┘  └──────────┘
```

Also displays issue context:

```
Issue #129: Add flexible skip options
State: [3] Implement
Progress: 3/8
Branch: feat-issue-129
```

## State Persistence

State tracked in git branch and environment:

```
Branch: <type>-issue-<number>
Status: implementation in progress
Current step: test or verify
Modified files: tracked via git
```

Resumable by checking current branch state and git status.

## Implementation Details

### Input
- `issue_number` (GitHub issue #)

### Output
- Fully implemented issue with:
  - Code changes across affected layers (via implementation-implement skill)
  - All tests passing (via implementation-test skill)
  - Docker containers running with changes (via implementation-verify skill)
  - Conventional commit with issue reference (via implementation-finalize skill)
  - Pull request created with auto-close markers (Closes on separate lines)
  - PR links to issue and implementation plan

### Skills Called (in order)

1. **implementation-validate** - Validate issue readiness
2. **implementation-prepare** - Create feature branch
3. **implementation-implement** - Make code changes
4. **implementation-test** - Run test suite
5. **implementation-verify** - Docker rebuild + show summary
6. *User review pause*
7. **implementation-finalize** - Commit, push, create PR

### Error Handling
- Invalid issue number → error message
- Issue missing `ready-for-work` label → ABORT
- Issue already closed → ABORT
- Test failures → PAUSE, show errors, return to implementation
- Docker failures → PAUSE, show errors
- Git push failures → PAUSE, investigate

### Agent Responsibilities

Orchestrator:
- Calls skills in sequence
- Displays state progress at start of each response
- Manages pause points for user review
- Routes loops (e.g., changes requested → return to implement)
- Returns final PR URL

## Key Features

**Full Automation**: From branch to PR without manual git commands

**Test Verification**: All tests must pass before proceeding

**Change Tracking**: Shows exact files modified and impact

**Docker Support**: Verifies changes work in containerized environment

**Conventional Commits**: Auto-generates formatted commits with issue reference

**Auto-Close**: PR body includes "Closes #<number>" on separate line per issue for GitHub auto-closing

**User Control**: Pause point after verification allows review before commit

**State Progress**: Displays current state and progress at start of every response

## Integration Points

**Invocation**:
- Manual: `@agent-github-issue-implementation-orchestrator <issue-number>`
- Via `/github-issue-assign` skill redirect

**Prerequisite**: Issue must have `ready-for-work` label (set by planning orchestrator)

**Workflow Chain**:
1. `github-issue-triage-orchestrator` → labels as `ready-to-plan`
2. `github-issue-plan-orchestrator` → labels as `ready-for-work`
3. `github-issue-implementation-orchestrator` → implements and creates PR

## Related Agents & Skills

### Agents
- **github-issue-triage-orchestrator**: Validates and labels issues as `ready-to-plan`
- **github-issue-plan-orchestrator**: Creates structured implementation plans, labels as `ready-for-work`

### Supporting Skills
- **implementation-validate**: Issue validation and commit type determination
- **implementation-prepare**: Branch creation and setup
- **implementation-implement**: Code change execution
- **implementation-test**: Test suite verification
- **implementation-verify**: Docker rebuild and changes summary
- **implementation-finalize**: Commit, push, and PR creation

Each skill has independent entry points and can be called standalone if needed.

## Notes

- Agent idempotent: safe to re-run from failed state
- All git operations happen on isolated `<type>-issue-<number>` branch
- Tests must pass before user review pause
- User has final approval before commit/push
- PR auto-closes issue when merged (with separate Closes line per issue)
- Implementation plan from planning phase guides actual code changes
