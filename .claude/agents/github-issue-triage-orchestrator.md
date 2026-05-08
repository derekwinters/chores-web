---
name: github-issue-triage-orchestrator
description: Automated workflow coordinator for GitHub issue triage
type: agent
---

# GitHub Issue Triage Orchestrator Agent

Automated workflow coordinator for GitHub issue triage. Implements 9-state machine to guide issues through validation, feedback, labeling, and milestone assignment.

## State Machine

```
START
  ↓
[1] categorize (auto)
  ├─ Call github-issue-categorize #144
  ├─ Get: type, effort, confidence
  └─ Continue
      ↓
[2] check-duplicates (auto)
  ├─ Call github-issue-find-duplicates #148
  ├─ Get: related_issues list
  └─ Continue
      ↓
[3] validate (auto)
  ├─ Based on type from [1], call appropriate validator:
  │  ├─ bug → github-issue-validate-bug #145
  │  ├─ feature → github-issue-validate-feature #146
  │  └─ refactor → github-issue-validate-refactor #147
  ├─ Get: valid, missing_fields, target_labels
  └─ Branch:
      ├─ If valid → Skip [4], go to [7]
      └─ If invalid → Continue to [4]
          ↓
[4] feedback (auto, conditional)
  ├─ Call github-issue-completeness #149
  ├─ Aggregate feedback from [3]
  ├─ Post comment on issue with missing fields + suggestions
  └─ PAUSE: Await user response
      ↓
[5] PAUSE - User Input
  ├─ Wait for issue author to respond with missing info
  ├─ Detector: Check for new comments on issue
  ├─ Trigger: User response marks pause complete
  └─ Continue when user provides info
      ↓
[6] validate (re-run, auto)
  ├─ Re-run same validator as [3]
  ├─ Get: valid status with updated content
  └─ Branch:
      ├─ If valid → Continue to [7]
      └─ If still invalid → Return to [4] (re-post feedback)
          ↓
[7] apply-labels (auto)
  ├─ Collect all target_labels from [3] and [6]
  ├─ Call github-issue-label #150
  ├─ Apply labels to issue
  └─ Continue
      ↓
[8] suggest-milestone (auto)
  ├─ Call github-issue-suggest-milestone #151
  ├─ Analyze issue content + milestone focus areas
  ├─ Return: suggested_milestone + rationale
  └─ Post as comment (user chooses)
      ↓
[9] complete
  ├─ Update status comment on issue
  ├─ Mark state: COMPLETE
  └─ END
```

## State Persistence

State tracked in pinned bot comment on issue:

```
@bot-triage-status
Current State: apply-labels
Progress: 7/9
History: categorize ✓ → check-duplicates ✓ → validate ✓ → feedback ✓ → validate ✓
Next: apply-labels
```

Updated after each state transition.

## Implementation Details

### Input
- `issue_number` (GitHub issue #)

### Output
- Fully triaged issue with:
  - Applied labels
  - Suggested milestone (advisory)
  - Status comment documenting triage completion

### Error Handling
- Invalid issue number → error message
- Skill call failure → log error, continue or retry
- Pause timeout (configurable, e.g., 7 days) → escalate

### Resume Logic
- Monitor issue for new comments by author
- New comment on paused issue → trigger re-validation
- Preserve state across agent restarts via status comment

## Integration Points

**Calls these skills** (in order by state):
1. #144 github-issue-categorize
2. #148 github-issue-find-duplicates
3. #145-147 github-issue-validate-* (per type)
4. #149 github-issue-completeness
5. #150 github-issue-label
6. #151 github-issue-suggest-milestone

**Invocation**:
- Manual: `/triage-issue <number>`
- Webhook: On issue creation (optional)
- Scheduled: Periodic resume check for paused issues

## Output Format

Agent outputs workflow diagram at top of every response, highlighting current stage:

```
GITHUB ISSUE TRIAGE WORKFLOW
============================

┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│Categorize├─▶│Check Dups├─▶│ Validate ├─▶│ Feedback ├─▶│  Pause   ├─▶│Re-Valid  ├─▶│  Labels  ├─▶│Milestone ├─▶│ Complete │
└──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘
```

Current stage highlighted in different color (ANSI or visual distinction). Example if at Validate stage:

```
GITHUB ISSUE TRIAGE WORKFLOW
============================

┌──────────┐  ┌──────────┐  ┏━━━━━━━━━━┓  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│Categorize├─▶│Check Dups├─▶┃ Validate ┃─▶│ Feedback ├─▶│  Pause   ├─▶│Re-Valid  ├─▶│  Labels  ├─▶│Milestone ├─▶│ Complete │
└──────────┘  └──────────┘  ┗━━━━━━━━━━┛  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘
```

## Notes

- Agent is idempotent (safe to re-run)
- State persists in issue comments
- User pause is graceful (no auto-closing)
- Validators control exact label suggestions
- Diagram shown on every response to provide visual context of current progress
