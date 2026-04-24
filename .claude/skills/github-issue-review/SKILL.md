---
name: github-issue-review
description: Review GitHub issue content for completeness and add ready-to-plan label
---

# GitHub Issue Review

Reviews GitHub issue content for completeness, updates description/acceptance criteria as needed, and labels as `ready-to-plan` when complete.

## Usage

```
/github-issue-review <issue-number>
```

## Workflow

1. **Fetch issue**: Get issue details from GitHub
2. **Check status**: Skip if `ready-to-plan` or `ready-for-work` labels exist
3. **Review completeness**: Validate issue has:
   - Clear title
   - Detailed description of problem/feature
   - Acceptance criteria or requirements
   - Any relevant context or examples
4. **Update if needed**: Edit issue to add missing sections
5. **Add label**: Apply `ready-to-plan` label when complete

## Completeness Checklist

Issue must have:
- **Title**: Clear, specific description of work
- **Description**: Problem statement or feature overview (2+ sentences)
- **Acceptance Criteria**: What constitutes done (3+ items or equivalent detail)
- **Context**: Environment, examples, related issues, or additional details

## Automatic Updates

If issue is incomplete, add/update:
- Acceptance Criteria section if missing
- Examples or test cases if vague
- Environment/setup details if needed
- Links to related issues

## Labels

- **ready-to-plan**: Issue is complete and ready for implementation planning
- **ready-for-work**: Issue already planned, skip this workflow
- **ready-to-plan**: Already present, skip this workflow

## Examples

```
/github-issue-review 42
```
Reviews issue #42, updates if needed, adds ready-to-plan label

## Notes

- Don't modify if issue already labeled `ready-to-plan` or `ready-for-work`
- Preserve original intent while clarifying
- Be respectful of submitter's words
- Link related issues when helpful
