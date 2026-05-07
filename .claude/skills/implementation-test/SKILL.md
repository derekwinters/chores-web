---
name: implementation-test
description: Run tests for implemented changes
---

# Implementation Test Skill

Runs test suite to verify implemented changes.

## Usage

```
/implementation-test
```

## Workflow

1. **Run backend tests**: `pytest` in backend directory
2. **Run frontend tests**: If applicable
3. **Verify all tests pass**: Check exit codes
4. **Report results**:
   - Total tests run
   - Passed/Failed counts
   - Coverage if applicable
   - Any failures with error messages

## Output

- ✅ All tests passed
  - Total tests: N
  - Coverage: X%
  - Ready for next phase
- ❌ Tests failed
  - Failed test count and names
  - Error messages
  - Blocks workflow until fixed

## Error Handling

If tests fail:
- Report exactly which tests failed
- Show error output
- Pause workflow for user review and fixes

## Notes

- Called by orchestrator after implementation
- Tests must all pass before proceeding
- Can be called independently to verify changes
