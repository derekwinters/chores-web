---
name: github-issue-plan
description: Review GitHub issue and determine implementation solution with user
---

# GitHub Issue Planning

Reviews GitHub issue content and works with user to determine the right implementation approach. Adds `ready-for-work` label when solution is agreed upon.

## Usage

```
/github-issue-plan <issue-number>
```

## Workflow

1. **Fetch issue**: Get complete issue details from GitHub
2. **Check status**: 
   - Require `ready-to-plan` label
   - Skip if `ready-for-work` or `ready-for-implementation` labels exist
3. **Review requirements**: Analyze acceptance criteria and context
4. **Propose solution**: Suggest implementation approach with:
   - Affected files/components
   - High-level steps
   - Potential challenges or trade-offs
5. **Discuss with user**: Refine approach based on feedback
6. **Agree on plan**: Get explicit user sign-off ("Do you agree?")
7. **Post plan**: Add finalized plan as issue comment
8. **Update labels**: Remove `ready-to-plan`, add `ready-for-work`

**⚠️ CRITICAL**: This skill defines and documents the plan only. It does NOT initiate implementation under any circumstances. User confirmation of the plan is NOT authorization to implement. Implementation can only begin when the `/github-issue-assign` skill is explicitly invoked.

## Solution Elements

Propose:
- **Files to change**: Which components/modules need updates
- **Implementation steps**: 3-5 key steps to address issue
- **Testing approach**: How to verify the fix/feature
- **Potential issues**: Edge cases or considerations
- **Alternatives**: Other approaches considered and why chosen

## Labels

- **ready-to-plan**: Issue complete, ready for planning (from `/github-issue-review`)
- **ready-for-work**: Solution planned, ready for implementation (added by this skill)
- **ready-for-work** or **ready-for-implementation**: Already present, skip this workflow

## Examples

```
/github-issue-plan 42
```
Reviews issue #42, proposes solution, adds ready-for-work label after agreement

## Notes

- Don't modify if already labeled for implementation
- Seek clarification if requirements are unclear
- Be specific in proposed solution, not vague
- Ask user questions to refine approach
- **NEVER start implementation** — only define and document the plan
- User agreement with plan ≠ authorization to implement
- Implementation begins ONLY when `/github-issue-assign` skill is invoked
